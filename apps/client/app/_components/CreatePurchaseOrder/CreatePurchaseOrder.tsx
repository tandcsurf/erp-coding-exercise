'use client'

import React, { useEffect, useState } from 'react';
import { Item, ParentItem } from '../../parent-items/page';

interface LineItem {
  item: Item;
  quantity: number;
}

const PurchaseOrderForm = () => {
  const [vendorName, setVendorName] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [parentItems, setParentItems] = useState<ParentItem[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch('http://localhost:3100/api/parent-items', { cache: 'no-cache' });
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setParentItems(data);
      } catch (error) {
        console.error(error);
        // Handle fetch error
      }
    };

    getData();
  }, []);

  const handleAddItem = (item: Item) => {
    setLineItems(prevItems => {
      if (prevItems.find(lineItem => lineItem.item.id === item.id)) {
        return prevItems;
      }
      return [...prevItems, { item, quantity: 1 }];
    });
  };

  const handleQuantityChange = (item: Item, quantity: number) => {
    setLineItems(prevItems => 
      prevItems.map(lineItem => 
        lineItem.item.id === item.id ? { ...lineItem, quantity: quantity } : lineItem
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setLineItems(prevItems => prevItems.filter(item => item.item.id !== itemId));
  };

  const handleSubmit = async () => {

    const purchaseOrderData = {
      vendor_name: vendorName,
      order_date: new Date(orderDate),
      expected_delivery_date: new Date(expectedDeliveryDate),
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      // Handle response
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="vendorName">Vendor Name:</label>
        <input
          type="text"
          id="vendorName"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="orderDate">Order Date:</label>
        <input
          type="date"
          id="orderDate"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="expectedDeliveryDate">Expected Delivery Date:</label>
        <input
          type="date"
          id="expectedDeliveryDate"
          value={expectedDeliveryDate}
          onChange={(e) => setExpectedDeliveryDate(e.target.value)}
        />
      </div>
      <fieldset>
          <legend>Select Items:</legend>
          {parentItems.map(parentItem => (
            <div key={parentItem.id}>
              <h4>{parentItem.name}</h4>
              {parentItem.items.map(item => (
                <div key={item.id}>
                  <button type="button" onClick={() => handleAddItem(item)}>
                    Add {item.name} - {item.sku} - Price: {item.price}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>Selected Items:</legend>
          {lineItems.map(({ item, quantity }) => (
            <div key={item.id}>
              <label htmlFor={`quantity_${item.id}`}>{item.name} - Quantity:</label>
              <input 
                type="number"
                id={`quantity_${item.id}`} 
                value={quantity}
                onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
                min="1"
              />
              <button type="button" onClick={() => handleRemoveItem(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </fieldset>

        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default PurchaseOrderForm;