import { GraphQLContext } from '../../../shared/graphql/context.js';
declare class ProductImage {
    url: string;
    alt?: string;
    sortOrder?: number;
}
declare class ProductImageInput {
    url: string;
    alt?: string;
    sortOrder?: number;
}
declare class ProductDimensions {
    length: number;
    width: number;
    height: number;
}
declare class ProductType {
    id: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    categoryId?: string;
    brandId?: string;
    images: ProductImage[];
    thumbnailUrl?: string;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    weight?: number;
    dimensions: ProductDimensions;
    createdAt: Date;
    updatedAt: Date;
}
declare class CategoryType {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
}
declare class BrandType {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    isActive: boolean;
    createdAt: Date;
}
declare class PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}
declare class ProductEdge {
    node: ProductType;
    cursor: string;
}
declare class ProductConnection {
    edges: ProductEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}
declare class ProductFilter {
    categoryId?: string;
    brandId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}
declare class ProductSort {
    field?: 'name' | 'price' | 'createdAt';
    direction?: 'ASC' | 'DESC';
}
declare class Pagination {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
declare class CreateProduct {
    name: string;
    slug?: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    description?: string;
    categoryId?: string;
    brandId?: string;
    images?: ProductImageInput[];
    isFeatured?: boolean;
}
declare class UpdateProduct {
    id: string;
    name?: string;
    price?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    description?: string;
    categoryId?: string;
    brandId?: string;
}
export declare class ProductResolver {
    product(id: string, ctx: GraphQLContext): Promise<ProductType | null>;
    productBySlug(slug: string, ctx: GraphQLContext): Promise<ProductType | null>;
    products(filter: ProductFilter, sort: ProductSort, pagination: Pagination, ctx: GraphQLContext): Promise<ProductConnection>;
    createProduct(input: CreateProduct, ctx: GraphQLContext): Promise<ProductType>;
    updateProduct(input: UpdateProduct, ctx: GraphQLContext): Promise<ProductType>;
    deleteProduct(id: string, ctx: GraphQLContext): Promise<boolean>;
    category(product: ProductType, ctx: GraphQLContext): Promise<CategoryType | null>;
    brand(product: ProductType, ctx: GraphQLContext): Promise<BrandType | null>;
    private mapProduct;
    private mapCategory;
    private mapBrand;
}
export declare class CategoryResolver {
    category(id: string, ctx: GraphQLContext): Promise<CategoryType | null>;
    categories(ctx: GraphQLContext): Promise<CategoryType[]>;
    parent(category: CategoryType, ctx: GraphQLContext): Promise<CategoryType | null>;
    children(category: CategoryType, ctx: GraphQLContext): Promise<CategoryType[]>;
    private mapCategory;
}
export declare class BrandResolver {
    brand(id: string, ctx: GraphQLContext): Promise<BrandType | null>;
    brands(ctx: GraphQLContext): Promise<BrandType[]>;
    private mapBrand;
}
export {};
//# sourceMappingURL=product.resolver.d.ts.map