'use client'

import React, { useState } from 'react';
import { useFetchPurchaseOrders } from '../_hooks/useGetPurchaseOrders';
import { useRemovePurchaseOrder } from '../_hooks/useRemovePurchaseOrder';
import CreatePurchaseOrderRHF from "../_components/CreatePurchaseOrder/CreatePurchaseOrderRHF";
import { PurchaseOrder } from '../_types/purchaseOrder';
import Link from 'next/link';

export default function Index() {
  const removePurchaseOrder = useRemovePurchaseOrder();
  const { data: purchaseOrders, isLoading, isError, error } = useFetchPurchaseOrders();
  const [removalError, setRemovalError] = useState<string | null>(null);

  const handleRemove = async (id: string | number) => {
    // Note: prob nicer to replace this with a modal
    if (window.confirm('Are you sure you want to remove this purchase order?')) {
      removePurchaseOrder.mutate(id, {
        onError: (error: unknown) => {
          if (error instanceof Error) {
            setRemovalError(error.message);
          } else {
            setRemovalError('An error occurred while removing the order.');
          }
        },
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (isLoading) {
    return <div>Loading purchase orders...</div>;
  }

  if (isError) {
    return <div>Error loading purchase orders: {error.message}</div>;
  }

  return (
    <>
      <h1 className="text-2xl">Purchase Orders</h1>
      <table className="border-collapse table-auto w-full text-sm mb-12">
        <thead>
          <tr>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Order Number</th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Vendor</th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Order Date</th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Expected Delivery Date</th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Line Items</th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Total Cost</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
          {purchaseOrders && purchaseOrders.length > 0 ? purchaseOrders.map((purchaseOrder: PurchaseOrder) => (
            <tr key={purchaseOrder.id}>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{purchaseOrder.id}</td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{purchaseOrder.vendor_name}</td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{new Date(purchaseOrder.order_date).toLocaleDateString()}</td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{new Date(purchaseOrder.expected_delivery_date).toLocaleDateString()}</td>
             
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                <ul>
                  {purchaseOrder.purchase_order_line_items.map((lineItem) => (
                    <li key={lineItem.id}>
                      Item ID: {lineItem.item_id}, Quantity: {lineItem.quantity}, Unit Cost: {formatCurrency(lineItem.unit_cost)}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {formatCurrency(
                  purchaseOrder.purchase_order_line_items.reduce((total, item) => total + item.unit_cost * item.quantity, 0)
                )}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                <Link href={`/purchase-orders/${purchaseOrder.id}`}>
                  Modify
                </Link>
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                <button onClick={() => handleRemove(purchaseOrder.id)}>
                  Remove
                </button>
              </td>
            </tr>
          )) : (
            <p>No purchase orders available.</p>
          )}
        </tbody>
      </table>
      {removalError && <p>{removalError}</p>}
      <div className="mb-20">
        <CreatePurchaseOrderRHF />
      </div>
    </>
  );
}
