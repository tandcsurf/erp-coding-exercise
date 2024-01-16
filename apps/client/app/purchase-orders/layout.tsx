'use client'

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}></QueryClientProvider>

export default function PurchaseOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}