'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useRemovePurchaseOrder } from '../../_hooks/useRemovePurchaseOrder';
import { useGetPurchaseOrderById } from '../../_hooks/useGetPurchaseOrderById';

import UpdatePurchaseOrderForm from '../../_components/UpdatePurchaseOrder/UpdatePurchaseOrderRHF';

export default function ModifyPurchaseOrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: purchaseOrder, isLoading, isError, error } = useGetPurchaseOrderById(id);
  const removePurchaseOrder = useRemovePurchaseOrder();
  const [removalError, setRemovalError] = useState<string | null>(null);

  const handleRemove = async () => {
    // Note: prob nicer to replace this with a modal
    if (window.confirm('Are you sure you want to remove this purchase order?')) {
      removePurchaseOrder.mutate(id, {
        onSuccess: () => {
          router.push('/purchase-orders');
        },
        onError: (error: unknown) => {
          // Error handling
          if (error instanceof Error) {
            setRemovalError(error.message);
          } else {
            setRemovalError('An error occurred while removing the order.');
          }
        },
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!purchaseOrder) {
    return <div>Purchase order not found.</div>;
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl mb-12">Purchase Order Details</h2>
        <p className="text-xl underline mb-2">Vendor Name</p>
        <p className="text-md mb-8">{purchaseOrder.vendor_name}</p>
        <p className="text-xl underline mb-2">Order Date:</p>
        <p className="text-md mb-8">{new Date(purchaseOrder.order_date).toLocaleDateString()}</p>
        <p className="text-xl underline mb-2">Expected Delivery Date:</p>
        <p className="text-md mb-8">{new Date(purchaseOrder.expected_delivery_date).toLocaleDateString()}</p>
        <h3 className="text-xl underline mb-2">Line Items</h3>
        <table className="border-collapse table-auto w-full max-w-[400px] text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Item ID</th>
              <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Quantity</th>
              <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Unit Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800">
            {purchaseOrder.purchase_order_line_items.map((item) => (
              <tr key={item.id}>
                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item.item_id}</td>
                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item.quantity}</td>
                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">${item.unit_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-20">
        <UpdatePurchaseOrderForm purchaseOrder={purchaseOrder} id={id} />
        {removalError && <p>{removalError}</p>}
        <button className="bg-white px-2 rounded-md" onClick={handleRemove}>Remove Purchase Order</button>
      </div>
    </>
  );
}
