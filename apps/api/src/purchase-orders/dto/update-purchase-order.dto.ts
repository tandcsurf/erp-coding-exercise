class UpdatePurchaseOrderLineItemDto {
  id: number;
  quantity?: number;
  unit_cost?: number;
}

export class UpdatePurchaseOrderDto {
  vendor_name?: string;
  order_date?: Date;
  expected_delivery_date?: Date;
  purchase_order_line_items?: UpdatePurchaseOrderLineItemDto[];
}
