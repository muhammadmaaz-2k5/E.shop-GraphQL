import { GraphQLContext } from '../shared/graphql/context.js';
declare class OrderAddressType {
    firstName?: string;
    lastName?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
declare class OrderItemType {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
declare class OrderType {
    id: string;
    orderNumber: string;
    userId: string;
    status: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    total: number;
    items: OrderItemType[];
    shippingAddress: OrderAddressType;
    billingAddress: OrderAddressType;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare class OrderAddressInput {
    firstName?: string;
    lastName?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
declare class CreateOrderInput {
    shippingAddress: OrderAddressInput;
    billingAddress?: OrderAddressInput;
}
export declare class OrderResolver {
    order(id: string, ctx: GraphQLContext): Promise<OrderType | null>;
    orders(limit: number, ctx: GraphQLContext): Promise<OrderType[]>;
    createOrder(input: CreateOrderInput, ctx: GraphQLContext): Promise<OrderType>;
    cancelOrder(id: string, ctx: GraphQLContext): Promise<OrderType>;
    updateOrderStatus(id: string, status: string, ctx: GraphQLContext): Promise<OrderType>;
    orderUpdated(order: OrderType): OrderType;
    orderCreated(order: OrderType): OrderType;
    private mapOrder;
}
export {};
//# sourceMappingURL=order.resolver.d.ts.map