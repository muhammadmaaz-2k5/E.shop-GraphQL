import { createLogger } from '../../shared/infrastructure/logger/index.js';
import { NotFoundError, BusinessError } from '../../shared/graphql/errors/index.js';
import { Cart as CartModel, CartItem as CartItemModel, Product as ProductModel } from '../../shared/infrastructure/database/index.js';
const log = createLogger('cart-service');
export class CartRepository {
    constructor(_db) { }
    async getOrCreateCart(userId) {
        try {
            // Try to get existing cart
            let cart = await CartModel.findOne({
                where: { userId },
                include: [{ model: CartItemModel, as: 'items' }]
            });
            if (cart) {
                return this.mapCart(cart);
            }
            // Create new cart
            cart = await CartModel.create({ userId });
            const freshCart = await CartModel.findByPk(cart.id, {
                include: [{ model: CartItemModel, as: 'items' }]
            });
            return this.mapCart(freshCart);
        }
        catch (error) {
            log.error({ error, userId }, 'Failed to create cart');
            throw new BusinessError('Failed to create cart');
        }
    }
    async addItem(userId, productId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        // Get product price
        const product = await ProductModel.findByPk(productId);
        if (!product || !product.isActive) {
            throw new NotFoundError('Product', productId);
        }
        const unitPrice = product.price;
        const totalPrice = unitPrice * quantity;
        // Check if item already exists
        const item = await CartItemModel.findOne({
            where: { cartId: cart.id, productId }
        });
        if (item) {
            // Update quantity
            const newQuantity = item.quantity + quantity;
            const newTotal = unitPrice * newQuantity;
            await item.update({ quantity: newQuantity, totalPrice: newTotal });
        }
        else {
            // Insert new item
            await CartItemModel.create({
                cartId: cart.id,
                productId,
                quantity,
                unitPrice,
                totalPrice,
            });
        }
        // Recalculate totals
        await this.recalculateCartTotals(cart.id);
        return this.getOrCreateCart(userId);
    }
    async updateItemQuantity(userId, itemId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(userId, itemId);
        }
        const item = await CartItemModel.findByPk(itemId, {
            include: [{ model: CartModel, as: 'cart' }]
        });
        if (!item || item.cart?.userId !== userId) {
            throw new NotFoundError('Cart item', itemId);
        }
        const unitPrice = item.unitPrice;
        await item.update({ quantity, totalPrice: unitPrice * quantity });
        await this.recalculateCartTotals(item.cartId);
        return this.getOrCreateCart(userId);
    }
    async removeItem(userId, itemId) {
        const item = await CartItemModel.findByPk(itemId, {
            include: [{ model: CartModel, as: 'cart' }]
        });
        if (!item || item.cart?.userId !== userId) {
            throw new NotFoundError('Cart item', itemId);
        }
        const cartId = item.cartId;
        await item.destroy();
        await this.recalculateCartTotals(cartId);
        return this.getOrCreateCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await CartItemModel.destroy({ where: { cartId: cart.id } });
        await CartModel.update({ subtotal: 0, total: 0 }, { where: { id: cart.id } });
    }
    async deleteCart(userId) {
        await CartModel.destroy({ where: { userId } });
    }
    async recalculateCartTotals(cartId) {
        const items = await CartItemModel.findAll({ where: { cartId } });
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const cart = await CartModel.findByPk(cartId);
        if (cart) {
            const discount = cart.discountAmount || 0;
            const tax = cart.taxAmount || 0;
            const shipping = cart.shippingAmount || 0;
            const total = subtotal + tax + shipping - discount;
            await cart.update({ subtotal, total });
        }
    }
    mapCart(data) {
        const json = data.toJSON();
        return {
            id: json.id,
            userId: json.userId,
            subtotal: json.subtotal,
            discountAmount: json.discountAmount,
            taxAmount: json.taxAmount,
            shippingAmount: json.shippingAmount,
            total: json.total,
            items: Array.isArray(json.items) ? json.items.map(this.mapCartItem) : [],
            createdAt: new Date(json.createdAt),
            updatedAt: new Date(json.updatedAt),
        };
    }
    mapCartItem(data) {
        return {
            id: data.id,
            cartId: data.cartId,
            productId: data.productId,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            totalPrice: data.totalPrice,
        };
    }
}
//# sourceMappingURL=cart.service.js.map