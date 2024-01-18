import { useQuery } from 'react-query';
import { PurchaseOrder } from '../_types/purchaseOrder';

const getPurchaseOrderById = async (id: string) => {
  const response = await fetch(`http://localhost:3100/api/purchase-orders/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useGetPurchaseOrderById = (id: string) => {
  console.log(id, "id")
  return useQuery<PurchaseOrder, Error>(['purchaseOrder', id], () => getPurchaseOrderById(id), {
    enabled: !!id,
  });
};