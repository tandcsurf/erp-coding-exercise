import { useMutation, useQueryClient } from 'react-query';

export interface CreatePurchaseOrderLineItems {
  item_id: string | number;
  quantity: number;
  unit_cost: number;
};

export interface CreatePurchaseOrder {
  vendor_name: string;
  order_date: Date;
  expected_delivery_date: Date;
  purchase_order_line_items: CreatePurchaseOrderLineItems[];
};

const createPurchaseOrder = async (newOrder: CreatePurchaseOrder) => {
  const response = await fetch('http://localhost:3100/api/purchase-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newOrder),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation(createPurchaseOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchaseOrders');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as Error).message;
      console.error('Mutation error:', errorMessage);
      // error logging vendor call here
    },
  });
}