'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Item, ParentItem } from '../../parent-items/page';
import { CreatePurchaseOrder, useCreatePurchaseOrder } from '../../_hooks/useCreatePurchaseOrder';

interface LineItem {
  item: Item;
  quantity: number;
}

interface PurchaseOrderFormData {
  vendor_name: string;
  order_date: string;
  expected_delivery_date: string;
};

const PurchaseOrderForm = () => {
  const { register, handleSubmit, control, getValues, formState: { errors } } = useForm<PurchaseOrderFormData>();
  const [parentItems, setParentItems] = useState<ParentItem[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const createPurchaseOrder = useCreatePurchaseOrder();

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
        // Error logging vendor call here
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

  const onSubmit = async (data: PurchaseOrderFormData) => {

    const updatedData: CreatePurchaseOrder = {
      ...data,
      order_date: new Date(data.order_date),
      expected_delivery_date: new Date(data.expected_delivery_date),
      purchase_order_line_items: lineItems.map(({ item, quantity }) => ({
        item_id: item.id,
        quantity,
        unit_cost: item.price,
      })),
    };

    createPurchaseOrder.mutate(updatedData);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
      <form className="" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <div className="mb-2">
            <label className="block text-md" htmlFor="vendorName">Vendor Name:</label>
            <input
              id="vendorName"
              {...register("vendor_name", { required: "Vendor name is required" })}
            />
            {errors.vendor_name && <p>{errors.vendor_name.message?.toString()}</p>}
          </div>

          <div className="mb-2">
            <label className="block text-md" htmlFor="orderDate">Order Date:</label>
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

          <div className="mb-2">
            <label className="block text-md" htmlFor="expectedDeliveryDate">Expected Delivery Date:</label>
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
        </div>
        <div className="flex mb-12">
          <div>
          <fieldset className="mb-2">
            <legend className="block text-2xl underline mb-4">Select Items:</legend>
            {parentItems.map(parentItem => (
              <div key={parentItem.id}>
                <h4 className="underline mb-2">{parentItem.name}</h4>
                {parentItem.items.map(item => (
                  <div key={item.id} className="mb-2">
                    <p className="mb-1">{item.name} - {item.sku} - Price: {item.price}</p>
                    <button className="bg-white px-2 rounded-md" type="button" onClick={() => handleAddItem(item)}>Add</button>
                  </div>
                ))}
              </div>
            ))}
          </fieldset>
          </div>
          <div>
            <fieldset className="mb-2">
              <legend className="text-2xl underline mb-6">Selected Items:</legend>
              {lineItems.map(({ item, quantity }) => (
                <div className="mb-2" key={item.id}>
                  <p>{item.name} - Unit Cost: {item.price}</p>
                  <p className="mb-1">
                  Quantity: 
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                    min="1"
                  /> 
                  </p>
                  <button className="bg-white px-2 rounded-md" type="button"  onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </div>
              ))}
            </fieldset>
          </div>
        </div>
        <button type="submit" className="bg-white px-2 rounded-md">Submit Order</button>
      </form>
  );
};

export default PurchaseOrderForm;
