import { useMutation, useQueryClient } from 'react-query';

const updatePurchaseOrder = async ({ id, updatedData }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries('purchaseOrders');
    },
  });
}

