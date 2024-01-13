import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {
  }

  // create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
  //   return 'This action adds a new purchaseOrder';
  // }
  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    // Destructure the DTO to separate purchase order data and line items
    const { purchase_order_line_items, ...purchaseOrderData } = createPurchaseOrderDto;

    // Use a transaction if your logic involves multiple write operations
    return this.prisma.$transaction(async (prisma) => {
      // Create the purchase order
      const purchaseOrder = await prisma.purchaseOrders.create({
        data: {
          ...purchaseOrderData,
          purchase_order_line_items: {
            create: purchase_order_line_items,
          },
        },
      });

      return purchaseOrder;
    });
  }

  async findAll() {
    return this.prisma.purchaseOrders.findMany({include: {purchase_order_line_items: true}});
  }

  async findOne(id: number) {
    return this.prisma.purchaseOrders.findUnique({
      where: { id },
      include: { purchase_order_line_items: true }
    });
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }
  // async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
  //   return this.prisma.purchaseOrders.update({
  //     where: { id },
  //     data: updatePurchaseOrderDto,
  //     include: { purchase_order_line_items: true }
  //   });
  // }

  async remove(id: number) {
    return this.prisma.purchaseOrders.delete({
      where: { id }
    });
  }
}
