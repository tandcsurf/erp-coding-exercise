import { useQuery } from 'react-query';
import { PurchaseOrder } from '../purchase-orders/page';

const fetchPurchaseOrders = async () => {
  const response = await fetch('http://localhost:3100/api/purchase-orders');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function useFetchPurchaseOrders() {
  return useQuery<PurchaseOrder[], Error>('purchaseOrders', fetchPurchaseOrders);
}