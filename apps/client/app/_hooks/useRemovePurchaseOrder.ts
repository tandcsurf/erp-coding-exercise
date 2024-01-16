import { useMutation, useQueryClient } from 'react-query';

const removePurchaseOrder = async (id) => {
  const response = await fetch(`http://localhost:3100/api/purchase-orders/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function useRemovePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation(removePurchaseOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchaseOrders');
    },
  });
}