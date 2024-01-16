'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { PurchaseOrders, PurchaseOrderLineItems } from '../page';
import { useRemovePurchaseOrder } from '../../_hooks/useRemovePurchaseOrder';
import { useUpdatePurchaseOrder } from '../../_hooks/useUpdatePurchaseOrder';

export default function ModifyPurchaseOrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { push } = useRouter();
  const { register, handleSubmit, control, getValues, setValue, formState: { errors } } = useForm();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrders | null>(null);
  const removePurchaseOrder = useRemovePurchaseOrder();
  const updatePurchaseOrder = useUpdatePurchaseOrder();

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

      console.log(data, "data");

      const convertToDates = (orderData) => {
        return {
          ...orderData,
          order_date: new Date(orderData.order_date),
          expected_delivery_date: new Date(orderData.expected_delivery_date),
        };
      };

      const updatedData = convertToDates(data);

      updatePurchaseOrder.mutate({ id, updatedData });
    };

    const handleRemove = async (id: string) => {
      removePurchaseOrder.mutate(id);
      push('/purchase-orders');
    }
      
    const formatDate = (date: Date) => {
      return new Date(date).toISOString().split('T')[0];
    };

    if (!purchaseOrder) {
      return <div>Loading...</div>;
    }

  return (
    <>
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
        {purchaseOrder.purchase_order_line_items.map((lineItem, index) => {
          register(`purchase_order_line_items.${index}.id`)
          setValue(`purchase_order_line_items.${index}.id`, lineItem.id);
          return (
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
        )})}
      </div>

      <button type="submit">Update Purchase Order</button>
    </form>
    <button onClick={() => handleRemove(id)}>Remove Purchase Order</button>
    </>
  )
}
