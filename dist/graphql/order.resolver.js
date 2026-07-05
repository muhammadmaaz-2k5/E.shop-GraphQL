var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Resolver, Query, Mutation, Arg, Ctx, InputType, Field, ObjectType, Int, ID, Subscription, Root, Authorized, } from 'type-graphql';
import { requireAuth } from '../shared/graphql/context.js';
import { OrderRepository } from '../modules/order/index.js';
import { BusinessError, ErrorCode } from '../shared/graphql/errors/index.js';
import { DateTimeScalar } from '../shared/graphql/scalars/index.js';
let OrderAddressType = class OrderAddressType {
    firstName;
    lastName;
    addressLine1;
    addressLine2;
    city;
    state;
    postalCode;
    country;
};
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderAddressType.prototype, "firstName", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderAddressType.prototype, "lastName", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressType.prototype, "addressLine1", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderAddressType.prototype, "addressLine2", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressType.prototype, "city", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressType.prototype, "state", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressType.prototype, "postalCode", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressType.prototype, "country", void 0);
OrderAddressType = __decorate([
    ObjectType()
], OrderAddressType);
let OrderItemType = class OrderItemType {
    id;
    productId;
    productName;
    productSku;
    quantity;
    unitPrice;
    totalPrice;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], OrderItemType.prototype, "id", void 0);
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], OrderItemType.prototype, "productId", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderItemType.prototype, "productName", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderItemType.prototype, "productSku", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], OrderItemType.prototype, "quantity", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], OrderItemType.prototype, "unitPrice", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], OrderItemType.prototype, "totalPrice", void 0);
OrderItemType = __decorate([
    ObjectType()
], OrderItemType);
let OrderType = class OrderType {
    id;
    orderNumber;
    userId;
    status;
    subtotal;
    discountAmount;
    taxAmount;
    shippingAmount;
    total;
    items;
    shippingAddress;
    billingAddress;
    trackingNumber;
    createdAt;
    updatedAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], OrderType.prototype, "id", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderType.prototype, "orderNumber", void 0);
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], OrderType.prototype, "userId", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderType.prototype, "status", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], OrderType.prototype, "subtotal", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], OrderType.prototype, "discountAmount", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], OrderType.prototype, "taxAmount", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], OrderType.prototype, "shippingAmount", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], OrderType.prototype, "total", void 0);
__decorate([
    Field(() => [OrderItemType]),
    __metadata("design:type", Array)
], OrderType.prototype, "items", void 0);
__decorate([
    Field(() => OrderAddressType),
    __metadata("design:type", OrderAddressType)
], OrderType.prototype, "shippingAddress", void 0);
__decorate([
    Field(() => OrderAddressType),
    __metadata("design:type", OrderAddressType)
], OrderType.prototype, "billingAddress", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderType.prototype, "trackingNumber", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], OrderType.prototype, "createdAt", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], OrderType.prototype, "updatedAt", void 0);
OrderType = __decorate([
    ObjectType()
], OrderType);
let OrderAddressInput = class OrderAddressInput {
    firstName;
    lastName;
    addressLine1;
    addressLine2;
    city;
    state;
    postalCode;
    country;
};
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "firstName", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "lastName", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "addressLine1", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "addressLine2", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "city", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "state", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "postalCode", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], OrderAddressInput.prototype, "country", void 0);
OrderAddressInput = __decorate([
    InputType()
], OrderAddressInput);
let CreateOrderInput = class CreateOrderInput {
    shippingAddress;
    billingAddress;
};
__decorate([
    Field(() => OrderAddressInput),
    __metadata("design:type", OrderAddressInput)
], CreateOrderInput.prototype, "shippingAddress", void 0);
__decorate([
    Field(() => OrderAddressInput, { nullable: true }),
    __metadata("design:type", OrderAddressInput)
], CreateOrderInput.prototype, "billingAddress", void 0);
CreateOrderInput = __decorate([
    InputType()
], CreateOrderInput);
let OrderResolver = class OrderResolver {
    async order(id, ctx) {
        const repo = new OrderRepository(ctx.db);
        const order = await repo.findById(id);
        if (!order)
            return null;
        if (order.userId !== ctx.user?.id && !ctx.isAdmin) {
            return null;
        }
        return this.mapOrder(order);
    }
    async orders(limit, ctx) {
        const user = requireAuth(ctx);
        const repo = new OrderRepository(ctx.db);
        const orders = await repo.findByUser(ctx.isAdmin && user ? user.id : ctx.user.id, limit || 20);
        return orders.map(this.mapOrder);
    }
    async createOrder(input, ctx) {
        const user = requireAuth(ctx);
        const repo = new OrderRepository(ctx.db);
        const order = await repo.create(user.id, input.shippingAddress, input.billingAddress);
        return this.mapOrder(order);
    }
    async cancelOrder(id, ctx) {
        const user = requireAuth(ctx);
        const repo = new OrderRepository(ctx.db);
        const existingOrder = await repo.findById(id);
        if (!existingOrder) {
            throw new BusinessError('Order not found', ErrorCode.NOT_FOUND);
        }
        if (existingOrder.userId !== user.id && !ctx.isAdmin) {
            throw new BusinessError('Not authorized to cancel this order', ErrorCode.FORBIDDEN);
        }
        const order = await repo.updateStatus(id, 'cancelled');
        return this.mapOrder(order);
    }
    async updateOrderStatus(id, status, ctx) {
        const repo = new OrderRepository(ctx.db);
        const order = await repo.updateStatus(id, status);
        return this.mapOrder(order);
    }
    orderUpdated(order) {
        return order;
    }
    orderCreated(order) {
        return order;
    }
    mapOrder(order) {
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            userId: order.userId,
            status: order.status,
            subtotal: order.subtotal,
            discountAmount: order.discountAmount,
            taxAmount: order.taxAmount,
            shippingAmount: order.shippingAmount,
            total: order.total,
            items: order.items.map(item => ({
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                productSku: item.productSku,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            })),
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress,
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
};
__decorate([
    Query(() => OrderType, { nullable: true }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "order", null);
__decorate([
    Query(() => [OrderType]),
    __param(0, Arg('limit', () => Int, { nullable: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "orders", null);
__decorate([
    Mutation(() => OrderType),
    __param(0, Arg('input')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOrderInput, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
__decorate([
    Mutation(() => OrderType),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "cancelOrder", null);
__decorate([
    Mutation(() => OrderType),
    Authorized(['admin', 'manager']),
    __param(0, Arg('id', () => ID)),
    __param(1, Arg('status', () => String)),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "updateOrderStatus", null);
__decorate([
    Subscription({
        topics: 'ORDER_UPDATED',
        filter: ({ payload, context }) => {
            const ctx = context;
            return ctx.user?.id === payload.userId || ctx.isAdmin;
        },
    }),
    __param(0, Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderType]),
    __metadata("design:returntype", OrderType)
], OrderResolver.prototype, "orderUpdated", null);
__decorate([
    Subscription({
        topics: 'ORDER_CREATED',
        filter: ({ payload, context }) => {
            const ctx = context;
            return ctx.user?.id === payload.userId || ctx.isAdmin;
        },
    }),
    __param(0, Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderType]),
    __metadata("design:returntype", OrderType)
], OrderResolver.prototype, "orderCreated", null);
OrderResolver = __decorate([
    Resolver(() => OrderType)
], OrderResolver);
export { OrderResolver };
//# sourceMappingURL=order.resolver.js.map