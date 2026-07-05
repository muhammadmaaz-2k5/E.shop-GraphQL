import { Sequelize } from 'sequelize';
export interface Cart {
    id: string;
    userId: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    total: number;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}
export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export declare class CartRepository {
    constructor(_db: Sequelize);
    getOrCreateCart(userId: string): Promise<Cart>;
    addItem(userId: string, productId: string, quantity: number): Promise<Cart>;
    updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<Cart>;
    removeItem(userId: string, itemId: string): Promise<Cart>;
    clearCart(userId: string): Promise<void>;
    deleteCart(userId: string): Promise<void>;
    private recalculateCartTotals;
    private mapCart;
    private mapCartItem;
}
//# sourceMappingURL=cart.service.d.ts.map