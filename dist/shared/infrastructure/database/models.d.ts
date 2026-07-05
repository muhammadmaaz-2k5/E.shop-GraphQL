import { Model, Sequelize } from 'sequelize';
export declare class User extends Model {
    id: string;
    email: string;
    role: 'admin' | 'manager' | 'customer';
    permissions: string[];
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    phone: string | null;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AuthUser extends Model {
    id: string;
    email: string;
    encryptedPassword: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RefreshToken extends Model {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    createdAt: Date;
}
export declare class Category extends Model {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    parentId: string | null;
    isActive: boolean;
    sortOrder: number;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
    parent?: Category;
}
export declare class Brand extends Model {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    isActive: boolean;
    websiteUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Product extends Model {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    sku: string;
    price: number;
    compareAtPrice: number | null;
    costPrice: number | null;
    categoryId: string | null;
    brandId: string | null;
    images: string[];
    thumbnailUrl: string | null;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    weight: number | null;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
    category?: Category;
    brand?: Brand;
}
export declare class Cart extends Model {
    id: string;
    userId: string | null;
    sessionId: string | null;
    couponId: string | null;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    total: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
    items?: CartItem[];
}
export declare class CartItem extends Model {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    product?: Product;
}
export declare class Order extends Model {
    id: string;
    orderNumber: string;
    userId: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAddress: any;
    billingAddress: any;
    shippingAmount: number;
    total: number;
    currency: string;
    couponId: string | null;
    notes: string | null;
    trackingNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
    items?: OrderItem[];
}
export declare class OrderItem extends Model {
    id: string;
    orderId: string;
    productId: string | null;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
}
export declare class Review extends Model {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    title: string | null;
    comment: string | null;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulVotes: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare function initModels(sequelize: Sequelize): void;
//# sourceMappingURL=models.d.ts.map