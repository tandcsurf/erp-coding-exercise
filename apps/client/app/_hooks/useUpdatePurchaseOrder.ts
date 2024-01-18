import { useMutation, useQueryClient } from 'react-query';
import { PurchaseOrder } from '../purchase-orders/page';

const updatePurchaseOrder = async ({ id, updatedData }: {id: string, updatedData: PurchaseOrder}) => {
  const response = await fetch(`http://localhost:3100/api/purchase-orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation(updatePurchaseOrder, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['purchaseOrder', variables.id]);
      queryClient.invalidateQueries('purchaseOrders');
    },
  });
}


