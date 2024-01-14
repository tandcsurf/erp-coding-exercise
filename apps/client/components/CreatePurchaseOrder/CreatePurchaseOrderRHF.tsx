'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Item, ParentItem } from '../../app/parent-items/page';

interface LineItem {
  item: Item;
  quantity: number;
}

const PurchaseOrderForm = () => {
  const { register, handleSubmit, control, getValues, formState: { errors } } = useForm();
  const [parentItems, setParentItems] = useState<ParentItem[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3100/api/parent-items', { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setParentItems(data);
      } catch (error) {
        console.error(error);
        // Handle fetch error here
      }
    };
    fetchData();
  }, []);

  const handleAddItem = (item: Item) => {
    const existingItem = lineItems.find(lineItem => lineItem.item.id === item.id);
    if (!existingItem) {
      setLineItems([...lineItems, { item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setLineItems(lineItems.filter(lineItem => lineItem.item.id !== itemId));
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setLineItems(lineItems.map(lineItem => 
      lineItem.item.id === itemId ? { ...lineItem, quantity: quantity } : lineItem
    ));
  };

  const onSubmit = async (data) => {

    const convertToDates = (orderData) => {
      return {
        ...orderData,
        order_date: new Date(orderData.order_date),
        expected_delivery_date: new Date(orderData.expected_delivery_date),
        // If there are other date fields in line items or elsewhere, convert them similarly
      };
    };

    const updatedData = convertToDates(data);

    const purchaseOrderData = {
      ...updatedData,
      purchase_order_line_items: lineItems.map(({ item, quantity }) => ({
        item_id: item.id,
        quantity,
        unit_cost: item.price,
      })),
    };

    try {
      const response = await fetch('http://localhost:3100/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseOrderData),
      });

      if (!response.ok) {
        throw new Error('Error in form submission');
      }

      // Handle successful form submission here
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
      // Handle submission error here
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="vendorName">Vendor Name:</label>
          <input
            id="vendorName"
            {...register("vendor_name", { required: "Vendor name is required" })}
          />
          {errors.vendor_name && <p>{errors.vendor_name.message?.toString()}</p>}
        </div>

        <div>
          <label htmlFor="orderDate">Order Date:</label>
          <input
            type="date"
            id="orderDate"
            {...register("order_date", { 
              required: "Order date is required", 
              min: { value: today, message: "Order date cannot be in the past" } 
            })}
          />
          {errors.order_date && <p>{errors.order_date.message?.toString()}</p>}
        </div>

        <div>
          <label htmlFor="expectedDeliveryDate">Expected Delivery Date:</label>
          <Controller
            name="expected_delivery_date"
            control={control}
            rules={{
              required: "Expected delivery date is required",
              validate: value => value >= getValues("order_date") || "Expected delivery must be on or past the order date"
            }}
            render={({ field }) => <input type="date" id="expectedDeliveryDate" {...field} />}
          />
          {errors.expected_delivery_date && <p>{errors.expected_delivery_date.message?.toString()}</p>}
        </div>

        <fieldset>
          <legend>Select Items:</legend>
          {parentItems.map(parentItem => (
            <div key={parentItem.id}>
              <h4>{parentItem.name}</h4>
              {parentItem.items.map(item => (
                <div key={item.id}>
                  {item.name} - {item.sku} - Price: {item.price}
                  <button type="button" onClick={() => handleAddItem(item)}>Add</button>
                </div>
              ))}
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>Selected Items:</legend>
          {lineItems.map(({ item, quantity }) => (
            <div key={item.id}>
              {item.name} - 
              Quantity: 
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                min="1"
              /> 
              - Unit Cost: {item.price}
              <button type="button" onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </div>
          ))}
        </fieldset>

        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default PurchaseOrderForm;
