'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { PurchaseOrders, PurchaseOrderLineItems } from '../../purchase-orders/page';

// ... Interfaces for PurchaseOrders and PurchaseOrderLineItems ...

export default function ModifyPurchaseOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  console.log(params, "params", id, "id");
  const { register, handleSubmit, control, getValues, formState: { errors } } = useForm();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrders | null>(null);

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      if (id) {
        try {
          const res = await fetch(`http://localhost:3100/api/purchase-orders/${id}`, { cache: 'no-cache' });
          if (!res.ok) {
            throw new Error('Failed to fetch purchase order');
          }
          const data = await res.json();
          console.log(data, "data");
          setPurchaseOrder(data);
        } catch (error) {
          console.log("whut");
          console.error(error);
        }
      };
    }
      fetchPurchaseOrder();
    }, [id])
      
  const onSubmit = async (data) => {
    // Logic to update the purchase order
    console.log(data);
    // You would typically send a PUT or PATCH request to your API endpoint here
    };
      
  if (!purchaseOrder) {
    return <div>Loading...</div>;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="vendorName">Vendor Name:</label>
          <input
          id="vendorName"
          defaultValue={purchaseOrder.vendor_name}
          {...register("vendor_name", { required: "Vendor name is required" })}
          />
          {errors.vendor_name && <p>{errors.vendor_name.message?.toString()}</p>}
    </div>
    <div>
    <label htmlFor="orderDate">Order Date:</label>
    <input
      type="date"
      id="orderDate"
      defaultValue={formatDate(purchaseOrder.order_date)}
      {...register("order_date", { required: "Order date is required" })}
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

  <div>
    <h3>Line Items:</h3>
    {purchaseOrder.purchase_order_line_items.map((lineItem, index) => (
      <div key={lineItem.id}>
        <label htmlFor={`item_${index}_quantity`}>Item {lineItem.item_id} - Quantity:</label>
        <input
          id={`item_${index}_quantity`}
          type="number"
          defaultValue={lineItem.quantity}
          {...register(`purchase_order_line_items.${index}.quantity`)}
        />
        <label htmlFor={`item_${index}_unit_cost`}>Unit Cost:</label>
        <input
          id={`item_${index}_unit_cost`}
          type="number"
          defaultValue={lineItem.unit_cost}
          step="0.01"
          {...register(`purchase_order_line_items.${index}.unit_cost`)}
        />
      </div>
    ))}
  </div>

  <button type="submit">Update Purchase Order</button>
</form>
  )
}
