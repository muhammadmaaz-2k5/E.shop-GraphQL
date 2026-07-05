import { Sequelize } from 'sequelize';
import { createLogger } from '../../shared/infrastructure/logger/index.js';
import { NotFoundError, BusinessError, ErrorCode } from '../../shared/graphql/errors/index.js';
import { CartRepository } from '../cart/index.js';
import { Order as OrderModel, OrderItem as OrderItemModel, Cart as CartModel, CartItem as CartItemModel } from '../../shared/infrastructure/database/index.js';
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderAddress {
  firstName?: string;
  lastName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

const log = createLogger('order-service');

export class OrderRepository {
  constructor(private db: Sequelize) {}

  async create(userId: string, shippingAddress: OrderAddress, billingAddress?: OrderAddress): Promise<Order> {
    const transaction = await this.db.transaction();
    try {
      // Get cart
      const cartRepo = new CartRepository(this.db);
      const cart = await cartRepo.getOrCreateCart(userId);

      if (cart.items.length === 0) {
        throw new BusinessError('Cannot create order with empty cart', ErrorCode.CART_EMPTY);
      }

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Calculate totals
      const subtotal = cart.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
      const taxAmount = 0;
      const shippingAmount = 0;
      const total = subtotal + taxAmount + shippingAmount - cart.discountAmount;

      // Create order
      const order = await OrderModel.create({
        orderNumber,
        userId,
        status: 'pending',
        subtotal,
        discountAmount: cart.discountAmount,
        taxAmount,
        shippingAmount,
        total,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
      }, { transaction });

      // Create order items
      const orderItems = cart.items.map((item: any) => ({
        orderId: order.id,
        productId: item.productId,
        productName: 'Product',
        productSku: 'SKU',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

      await OrderItemModel.bulkCreate(orderItems, { transaction });

      // Clear cart items directly in transaction
      await CartItemModel.destroy({ where: { cartId: cart.id }, transaction });
      await CartModel.update({ subtotal: 0, total: 0 }, { where: { id: cart.id }, transaction });

      await transaction.commit();
      log.info({ orderId: order.id, orderNumber, userId }, 'Order created');

      const result = await this.findById(order.id);
      return result!;
    } catch (error) {
      await transaction.rollback();
      log.error({ error, userId }, 'Failed to create order');
      if (error instanceof BusinessError) throw error;
      throw new BusinessError('Failed to create order');
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const data = await OrderModel.findByPk(id, {
        include: [{ model: OrderItemModel, as: 'items' }]
      });
      return data ? this.mapOrder(data) : null;
    } catch (error) {
      log.error({ error, id }, 'Failed to fetch order');
      return null;
    }
  }

  async findByUser(userId: string, limit = 20): Promise<Order[]> {
    try {
      const orders = await OrderModel.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
        include: [{ model: OrderItemModel, as: 'items' }]
      });
      return orders.map(this.mapOrder);
    } catch (error) {
      log.error({ error, userId }, 'Failed to fetch orders');
      return [];
    }
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order', orderId);
    }

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BusinessError(
        `Cannot transition from ${order.status} to ${status}`,
        ErrorCode.ORDER_NOT_CANCELLABLE
      );
    }

    try {
      await OrderModel.update({ status }, { where: { id: orderId } });
      log.info({ orderId, status }, 'Order status updated');

      const updated = await this.findById(orderId);
      return updated!;
    } catch (error) {
      log.error({ error, orderId, status }, 'Failed to update order status');
      throw new BusinessError('Failed to update order');
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  private mapOrder(data: OrderModel): Order {
    const json = data.toJSON() as any;
    return {
      id: json.id,
      orderNumber: json.orderNumber,
      userId: json.userId,
      status: json.status as OrderStatus,
      subtotal: json.subtotal,
      discountAmount: json.discountAmount,
      taxAmount: json.taxAmount,
      shippingAmount: json.shippingAmount,
      total: json.total,
      items: Array.isArray(json.items) ? json.items.map(this.mapOrderItem) : [],
      shippingAddress: json.shippingAddress || {} as OrderAddress,
      billingAddress: json.billingAddress || {} as OrderAddress,
      trackingNumber: json.trackingNumber ?? undefined,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    };
  }

  private mapOrderItem(data: any): OrderItem {
    return {
      id: data.id,
      productId: data.productId,
      productName: data.productName,
      productSku: data.productSku,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      totalPrice: data.totalPrice,
    };
  }
}
