class CreatePurchaseOrderLineItemDto {
  item_id: number;
  quantity: number;
  unit_cost: string;
}

export class CreatePurchaseOrderDto {
  vendor_name: string;
  order_date: Date;
  expected_delivery_date: Date;
  purchase_order_line_items: CreatePurchaseOrderLineItemDto[];
}