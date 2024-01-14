import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';

// export class UpdatePurchaseOrderDto extends PartialType(
//   CreatePurchaseOrderDto
// ) {}

class UpdatePurchaseOrderLineItemDto {
  id: number;
  quantity?: number;
  unit_cost?: number;
  // Add other fields that might need updating
}

export class UpdatePurchaseOrderDto {
  vendor_name?: string;
  order_date?: Date;
  expected_delivery_date?: Date;
  purchase_order_line_items?: UpdatePurchaseOrderLineItemDto[];
}
