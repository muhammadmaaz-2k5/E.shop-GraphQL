import { GraphQLContext } from '../shared/graphql/context.js';
declare class CartItemType {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
declare class CartType {
    id: string;
    userId: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    total: number;
    items: CartItemType[];
    itemCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare class AddToCartInput {
    productId: string;
    quantity: number;
}
declare class UpdateCartItemInput {
    itemId: string;
    quantity: number;
}
export declare class CartResolver {
    cart(ctx: GraphQLContext): Promise<CartType | null>;
    addToCart(input: AddToCartInput, ctx: GraphQLContext): Promise<CartType>;
    updateCartItem(input: UpdateCartItemInput, ctx: GraphQLContext): Promise<CartType>;
    removeFromCart(itemId: string, ctx: GraphQLContext): Promise<boolean>;
    clearCart(ctx: GraphQLContext): Promise<boolean>;
    private mapCart;
}
export {};
//# sourceMappingURL=cart.resolver.d.ts.map