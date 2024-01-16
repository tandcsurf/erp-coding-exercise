import { useMutation, useQueryClient } from 'react-query';

const createPurchaseOrder = async (newOrder) => {
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
  });
}