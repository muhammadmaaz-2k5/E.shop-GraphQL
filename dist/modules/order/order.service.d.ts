import { Sequelize } from 'sequelize';
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
export declare class OrderRepository {
    private db;
    constructor(db: Sequelize);
    create(userId: string, shippingAddress: OrderAddress, billingAddress?: OrderAddress): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByUser(userId: string, limit?: number): Promise<Order[]>;
    updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
    private generateOrderNumber;
    private mapOrder;
    private mapOrderItem;
}
//# sourceMappingURL=order.service.d.ts.map