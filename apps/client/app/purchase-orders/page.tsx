'use client'

import React, { useState, useEffect } from 'react';
import CreatePurchaseOrderRHF from "../../components/CreatePurchaseOrder/CreatePurchaseOrderRHF";
import Link from 'next/link';

export interface PurchaseOrderLineItems {
  id: number;
  purchase_order_id: number;
  item_id: number;
  quantity: number;
  unit_cost: number;
  created_at: Date;
  updated_at?: Date;
};

export interface PurchaseOrders {
  id: number;
  vendor_name: string;
  order_date: Date;
  expected_delivery_date: Date;
  created_at: Date;
  updated_at?: Date;
  purchase_order_line_items: PurchaseOrderLineItems[];
};

export default function Index() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrders[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3100/api/purchase-orders', { cache: 'no-cache' });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      setPurchaseOrders(data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleRemove = async (id: string) => {

    try {
      const response = await fetch(`http://localhost:3100/api/purchase-orders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the purchase order');
      }

      fetchData();
    
      console.log('Purchase order deleted successfully');
      // Optionally, redirect the user after successful deletion
      // router.push('/path-to-redirect');
    } catch (error) {
      console.error(error);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <>
      <h1 className="text-2xl">Purchase Orders</h1>
      <table className="border-collapse table-auto w-full text-sm">
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
          {purchaseOrders.map((purchaseOrder) => (
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
                <Link href={`/purchase-order-details/${purchaseOrder.id}`}>
                  Modify
                </Link>
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                <button onClick={() => handleRemove(purchaseOrder.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreatePurchaseOrderRHF />
    </>
  );
}

// import CreatePurchaseOrderRHF from "../../components/CreatePurchaseOrder/CreatePurchaseOrderRHF";

// interface PurchaseOrderLineItems {
//   id: number;
//   purchase_order_id: number;
//   item_id: number;
//   quantity: number;
//   unit_cost: number;
//   created_at: Date;
//   updated_at?: Date;
// };

// interface PurchaseOrders {
//   id: number;
//   vendor_name: string;
//   order_date: Date;
//   expected_delivery_date: Date;
//   created_at: Date;
//   updated_at?: Date;
//   purchase_order_line_items: PurchaseOrderLineItems[];
// };

// async function getData(): Promise<PurchaseOrders[]> {
//   const res = await fetch('http://localhost:3100/api/purchase-orders', {cache: 'no-cache'});
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   return res.json();
// }

// export default async function Index() {
//   const data = await getData()

//   return (
//     <>
//       <h1 className="text-2xl">Purchase Orders</h1>
//       <table className="border-collapse table-auto w-full text-sm">
//         <thead>
//         <tr>
//           <th
//             className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Vendor
//           </th>
//           <th
//             className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Line items
//           </th>
//         </tr>
//         </thead>
//         <tbody className="bg-white dark:bg-slate-800">
//         {data.map((purchaseOrder: PurchaseOrders) => (
//           <tr key={purchaseOrder.id}>
//             <td
//               className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{purchaseOrder.vendor_name}</td>
//             <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
//               <ul>
//                 {purchaseOrder.purchase_order_line_items.map((lineItem: PurchaseOrderLineItems) => (
//                   <li key={lineItem.id}>{lineItem.unit_cost}</li>
//                 ))}
//               </ul>
//             </td>
//           </tr>
//         ))}
//         </tbody>
//       </table>
//       <CreatePurchaseOrderRHF />
//     </>
//   );
// }
