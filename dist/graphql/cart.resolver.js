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
import { Resolver, Query, Mutation, Arg, Ctx, InputType, Field, ObjectType, Int, ID, } from 'type-graphql';
import { requireAuth } from '../shared/graphql/context.js';
import { CartRepository } from '../modules/cart/index.js';
import { DateTimeScalar } from '../shared/graphql/scalars/index.js';
let CartItemType = class CartItemType {
    id;
    productId;
    quantity;
    unitPrice;
    totalPrice;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], CartItemType.prototype, "id", void 0);
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], CartItemType.prototype, "productId", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], CartItemType.prototype, "quantity", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CartItemType.prototype, "unitPrice", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CartItemType.prototype, "totalPrice", void 0);
CartItemType = __decorate([
    ObjectType()
], CartItemType);
let CartType = class CartType {
    id;
    userId;
    subtotal;
    discountAmount;
    taxAmount;
    shippingAmount;
    total;
    items;
    itemCount;
    createdAt;
    updatedAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], CartType.prototype, "id", void 0);
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], CartType.prototype, "userId", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CartType.prototype, "subtotal", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CartType.prototype, "discountAmount", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CartType.prototype, "taxAmount", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CartType.prototype, "shippingAmount", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CartType.prototype, "total", void 0);
__decorate([
    Field(() => [CartItemType]),
    __metadata("design:type", Array)
], CartType.prototype, "items", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], CartType.prototype, "itemCount", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], CartType.prototype, "createdAt", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], CartType.prototype, "updatedAt", void 0);
CartType = __decorate([
    ObjectType()
], CartType);
let AddToCartInput = class AddToCartInput {
    productId;
    quantity;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], AddToCartInput.prototype, "productId", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], AddToCartInput.prototype, "quantity", void 0);
AddToCartInput = __decorate([
    InputType()
], AddToCartInput);
let UpdateCartItemInput = class UpdateCartItemInput {
    itemId;
    quantity;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], UpdateCartItemInput.prototype, "itemId", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UpdateCartItemInput.prototype, "quantity", void 0);
UpdateCartItemInput = __decorate([
    InputType()
], UpdateCartItemInput);
let CartResolver = class CartResolver {
    async cart(ctx) {
        if (!ctx.user)
            return null;
        const repo = new CartRepository(ctx.db);
        const cart = await repo.getOrCreateCart(ctx.user.id);
        return this.mapCart(cart);
    }
    async addToCart(input, ctx) {
        const user = requireAuth(ctx);
        const repo = new CartRepository(ctx.db);
        const cart = await repo.addItem(user.id, input.productId, input.quantity);
        return this.mapCart(cart);
    }
    async updateCartItem(input, ctx) {
        const user = requireAuth(ctx);
        const repo = new CartRepository(ctx.db);
        const cart = await repo.updateItemQuantity(user.id, input.itemId, input.quantity);
        return this.mapCart(cart);
    }
    async removeFromCart(itemId, ctx) {
        const user = requireAuth(ctx);
        const repo = new CartRepository(ctx.db);
        await repo.removeItem(user.id, itemId);
        return true;
    }
    async clearCart(ctx) {
        const user = requireAuth(ctx);
        const repo = new CartRepository(ctx.db);
        await repo.clearCart(user.id);
        return true;
    }
    mapCart(cart) {
        return {
            id: cart.id,
            userId: cart.userId,
            subtotal: cart.subtotal,
            discountAmount: cart.discountAmount,
            taxAmount: cart.taxAmount,
            shippingAmount: cart.shippingAmount,
            total: cart.total,
            items: cart.items.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            })),
            itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
};
__decorate([
    Query(() => CartType, { nullable: true }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "cart", null);
__decorate([
    Mutation(() => CartType),
    __param(0, Arg('input')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddToCartInput, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "addToCart", null);
__decorate([
    Mutation(() => CartType),
    __param(0, Arg('input')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateCartItemInput, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "updateCartItem", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, Arg('itemId', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "removeFromCart", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "clearCart", null);
CartResolver = __decorate([
    Resolver(() => CartType)
], CartResolver);
export { CartResolver };
//# sourceMappingURL=cart.resolver.js.map