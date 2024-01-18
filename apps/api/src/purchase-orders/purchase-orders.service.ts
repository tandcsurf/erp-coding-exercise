import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {
  }

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    const { purchase_order_line_items, ...purchaseOrderData } = createPurchaseOrderDto;

    return this.prisma.$transaction(async (prisma) => {
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

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    const { purchase_order_line_items, ...otherData } = updatePurchaseOrderDto;

    function convertLineItems(lineItems) {
      return lineItems.map(item => ({
        id: item.id ? parseInt(item.id) : undefined,
        quantity: item.quantity ? parseInt(item.quantity) : undefined,
        unit_cost: item.unit_cost ? parseFloat(item.unit_cost) : undefined,
      }));
    }

    const convertedLineItems = convertLineItems(purchase_order_line_items)

    return this.prisma.purchaseOrders.update({
      where: { id },
      data: {
        ...otherData,
        purchase_order_line_items: {
          update: convertedLineItems?.map(lineItem => ({
            where: { id: lineItem.id },
            data: lineItem,
          })),
        },
      },
      include: { purchase_order_line_items: true },
    });
  }

  async remove(id: number) {
    return this.prisma.purchaseOrders.delete({
      where: { id }
    });
  }
}
