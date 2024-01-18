export interface PurchaseOrderLineItems {
  id: string | number;
  purchase_order_id: string | number;
  item_id: string | number;
  quantity: number;
  unit_cost: number;
  created_at: Date;
  updated_at?: Date;
};

export interface PurchaseOrder {
  id: string | number;
  vendor_name: string;
  order_date: Date;
  expected_delivery_date: Date;
  created_at: Date;
  updated_at?: Date;
  purchase_order_line_items: PurchaseOrderLineItems[];
};
