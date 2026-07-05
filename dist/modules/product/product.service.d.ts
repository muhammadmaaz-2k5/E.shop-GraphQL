import { Sequelize } from 'sequelize';
import DataLoader from 'dataloader';
import type { Product, Category, Brand, ProductFilterInput, ProductSortInput, ConnectionCursor } from './product.types.js';
import type { CreateProductInput, PaginationInput } from './product.types.js';
export declare class ProductRepository {
    private db;
    constructor(db: Sequelize);
    findById(id: string): Promise<Product | null>;
    findBySlug(slug: string): Promise<Product | null>;
    findBySku(sku: string): Promise<Product | null>;
    findMany(params: {
        filter?: ProductFilterInput;
        sort?: ProductSortInput;
        pagination?: PaginationInput;
    }): Promise<ConnectionCursor<Product>>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: string, input: Partial<CreateProductInput>): Promise<Product>;
    delete(id: string): Promise<void>;
    private mapProduct;
}
export declare class CategoryRepository {
    constructor(_db: Sequelize);
    findById(id: string): Promise<Category | null>;
    findBySlug(slug: string): Promise<Category | null>;
    findAll(activeOnly?: boolean): Promise<Category[]>;
    getChildren(parentId: string): Promise<Category[]>;
    getParent(categoryId: string): Promise<Category | null>;
    private mapCategory;
}
export declare class BrandRepository {
    constructor(_db: Sequelize);
    findById(id: string): Promise<Brand | null>;
    findBySlug(slug: string): Promise<Brand | null>;
    findAll(activeOnly?: boolean): Promise<Brand[]>;
    private mapBrand;
}
export declare function createProductLoaders(db: Sequelize): {
    productById: DataLoader<string, Product | null, string>;
    categoryById: DataLoader<string, Category | null, string>;
    brandById: DataLoader<string, Brand | null, string>;
};
export type ProductLoaders = ReturnType<typeof createProductLoaders>;
//# sourceMappingURL=product.service.d.ts.map