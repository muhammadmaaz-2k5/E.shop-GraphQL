import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  declare id: string;
  declare email: string;
  declare role: 'admin' | 'manager' | 'customer';
  declare permissions: string[];
  declare firstName: string | null;
  declare lastName: string | null;
  declare avatarUrl: string | null;
  declare phone: string | null;
  declare isActive: boolean;
  declare emailVerified: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export class AuthUser extends Model {
  declare id: string;
  declare email: string;
  declare encryptedPassword: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export class RefreshToken extends Model {
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare revoked: boolean;
  declare createdAt: Date;
}

export class Category extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare imageUrl: string | null;
  declare parentId: string | null;
  declare isActive: boolean;
  declare sortOrder: number;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare parent?: Category;
}

export class Brand extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare logoUrl: string | null;
  declare isActive: boolean;
  declare websiteUrl: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export class Product extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare shortDescription: string | null;
  declare sku: string;
  declare price: number;
  declare compareAtPrice: number | null;
  declare costPrice: number | null;
  declare categoryId: string | null;
  declare brandId: string | null;
  declare images: string[];
  declare thumbnailUrl: string | null;
  declare isActive: boolean;
  declare isFeatured: boolean;
  declare isNew: boolean;
  declare weight: number | null;
  declare dimensions: { length: number; width: number; height: number };
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare category?: Category;
  declare brand?: Brand;
}

export class Cart extends Model {
  declare id: string;
  declare userId: string | null;
  declare sessionId: string | null;
  declare couponId: string | null;
  declare subtotal: number;
  declare discountAmount: number;
  declare taxAmount: number;
  declare shippingAmount: number;
  declare total: number;
  declare currency: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare expiresAt: Date | null;
  declare items?: CartItem[];
}

export class CartItem extends Model {
  declare id: string;
  declare cartId: string;
  declare productId: string;
  declare quantity: number;
  declare unitPrice: number;
  declare totalPrice: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare product?: Product;
}

export class Order extends Model {
  declare id: string;
  declare orderNumber: string;
  declare userId: string;
  declare status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  declare subtotal: number;
  declare discountAmount: number;
  declare taxAmount: number;
  declare shippingAddress: any;
  declare billingAddress: any;
  declare shippingAmount: number;
  declare total: number;
  declare currency: string;
  declare couponId: string | null;
  declare notes: string | null;
  declare trackingNumber: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare items?: OrderItem[];
}

export class OrderItem extends Model {
  declare id: string;
  declare orderId: string;
  declare productId: string | null;
  declare productName: string;
  declare productSku: string;
  declare quantity: number;
  declare unitPrice: number;
  declare totalPrice: number;
  declare createdAt: Date;
}

export class Review extends Model {
  declare id: string;
  declare productId: string;
  declare userId: string;
  declare rating: number;
  declare title: string | null;
  declare comment: string | null;
  declare isVerifiedPurchase: boolean;
  declare isApproved: boolean;
  declare helpfulVotes: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initModels(sequelize: Sequelize) {
  User.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('admin', 'manager', 'customer'), allowNull: false, defaultValue: 'customer' },
    permissions: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
    firstName: { type: DataTypes.TEXT, field: 'first_name' },
    lastName: { type: DataTypes.TEXT, field: 'last_name' },
    avatarUrl: { type: DataTypes.TEXT, field: 'avatar_url' },
    phone: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    emailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'email_verified' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  AuthUser.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    encryptedPassword: { type: DataTypes.TEXT, allowNull: false, field: 'encrypted_password' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, schema: 'auth', tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  RefreshToken.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    tokenHash: { type: DataTypes.TEXT, allowNull: false, unique: true, field: 'token_hash' },
    expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
    revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  }, { sequelize, tableName: 'refresh_tokens', timestamps: true, createdAt: 'created_at', updatedAt: false });

  Category.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    imageUrl: { type: DataTypes.TEXT, field: 'image_url' },
    parentId: { type: DataTypes.UUID, field: 'parent_id' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
    metaTitle: { type: DataTypes.TEXT, field: 'meta_title' },
    metaDescription: { type: DataTypes.TEXT, field: 'meta_description' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'categories', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  Brand.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    logoUrl: { type: DataTypes.TEXT, field: 'logo_url' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    websiteUrl: { type: DataTypes.TEXT, field: 'website_url' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'brands', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  Product.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    shortDescription: { type: DataTypes.TEXT, field: 'short_description' },
    sku: { type: DataTypes.TEXT, allowNull: false, unique: true },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, get() { return parseFloat(this.getDataValue('price')); } },
    compareAtPrice: { type: DataTypes.DECIMAL(12, 2), field: 'compare_at_price', get() { const val = this.getDataValue('compareAtPrice'); return val ? parseFloat(val) : null; } },
    costPrice: { type: DataTypes.DECIMAL(12, 2), field: 'cost_price', get() { const val = this.getDataValue('costPrice'); return val ? parseFloat(val) : null; } },
    categoryId: { type: DataTypes.UUID, field: 'category_id' },
    brandId: { type: DataTypes.UUID, field: 'brand_id' },
    images: { type: DataTypes.JSONB, defaultValue: [] },
    thumbnailUrl: { type: DataTypes.TEXT, field: 'thumbnail_url' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
    isNew: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_new' },
    weight: { type: DataTypes.DECIMAL(8, 3), get() { const val = this.getDataValue('weight'); return val ? parseFloat(val) : null; } },
    dimensions: { type: DataTypes.JSONB, defaultValue: { length: 0, width: 0, height: 0 } },
    metaTitle: { type: DataTypes.TEXT, field: 'meta_title' },
    metaDescription: { type: DataTypes.TEXT, field: 'meta_description' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'products', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  Cart.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    sessionId: { type: DataTypes.TEXT, field: 'session_id' },
    couponId: { type: DataTypes.UUID, field: 'coupon_id' },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, get() { return parseFloat(this.getDataValue('subtotal')); } },
    discountAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'discount_amount', get() { return parseFloat(this.getDataValue('discountAmount')); } },
    taxAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'tax_amount', get() { return parseFloat(this.getDataValue('taxAmount')); } },
    shippingAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'shipping_amount', get() { return parseFloat(this.getDataValue('shippingAmount')); } },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, get() { return parseFloat(this.getDataValue('total')); } },
    currency: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'USD' },
    expiresAt: { type: DataTypes.DATE, field: 'expires_at' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'carts', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  CartItem.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    cartId: { type: DataTypes.UUID, allowNull: false, field: 'cart_id' },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'unit_price', get() { return parseFloat(this.getDataValue('unitPrice')); } },
    totalPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'total_price', get() { return parseFloat(this.getDataValue('totalPrice')); } },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'cart_items', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  Order.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    orderNumber: { type: DataTypes.TEXT, allowNull: false, unique: true, field: 'order_number' },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'), allowNull: false, defaultValue: 'pending' },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, get() { return parseFloat(this.getDataValue('subtotal')); } },
    discountAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'discount_amount', get() { return parseFloat(this.getDataValue('discountAmount')); } },
    taxAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'tax_amount', get() { return parseFloat(this.getDataValue('taxAmount')); } },
    shippingAddress: { type: DataTypes.JSONB, defaultValue: {}, field: 'shipping_address' },
    billingAddress: { type: DataTypes.JSONB, defaultValue: {}, field: 'billing_address' },
    shippingAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'shipping_amount', get() { return parseFloat(this.getDataValue('shippingAmount')); } },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, get() { return parseFloat(this.getDataValue('total')); } },
    currency: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'USD' },
    couponId: { type: DataTypes.UUID, field: 'coupon_id' },
    notes: { type: DataTypes.TEXT },
    trackingNumber: { type: DataTypes.TEXT, field: 'tracking_number' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  OrderItem.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
    productId: { type: DataTypes.UUID, field: 'product_id' },
    productName: { type: DataTypes.TEXT, allowNull: false, field: 'product_name' },
    productSku: { type: DataTypes.TEXT, allowNull: false, field: 'product_sku' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'unit_price', get() { return parseFloat(this.getDataValue('unitPrice')); } },
    totalPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'total_price', get() { return parseFloat(this.getDataValue('totalPrice')); } },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  }, { sequelize, tableName: 'order_items', timestamps: true, createdAt: 'created_at', updatedAt: false });

  Review.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.TEXT },
    comment: { type: DataTypes.TEXT },
    isVerifiedPurchase: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_verified_purchase' },
    isApproved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_approved' },
    helpfulVotes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'helpful_votes' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, { sequelize, tableName: 'reviews', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

  // Define Associations
  RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });

  Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent', onDelete: 'SET NULL' });
  Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category', onDelete: 'SET NULL' });
  Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand', onDelete: 'SET NULL' });

  Cart.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
  CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
  CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });

  Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product', onDelete: 'SET NULL' });

  Review.belongsTo(Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });
  Review.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
}
