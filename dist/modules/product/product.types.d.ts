export interface Product {
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
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProductImage {
    url: string;
    alt?: string;
    sort_order?: number;
}
export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
    unit?: 'cm' | 'in';
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive: boolean;
    sortOrder: number;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Brand {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    isActive: boolean;
    websiteUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ConnectionCursor<T> {
    edges: Array<{
        node: T;
        cursor: string;
    }>;
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string;
        endCursor?: string;
    };
    totalCount: number;
}
export declare class CreateProductInput {
    name: string;
    slug?: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    description?: string;
    shortDescription?: string;
    categoryId?: string;
    brandId?: string;
    images?: ProductImage[];
    isFeatured?: boolean;
    isNew?: boolean;
}
export declare class UpdateProductInput {
    id: string;
    name?: string;
    slug?: string;
    price?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    description?: string;
    categoryId?: string;
    brandId?: string;
    images?: ProductImage[];
}
export declare class ProductFilterInput {
    categoryId?: string;
    brandId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}
export declare class ProductSortInput {
    field?: 'name' | 'price' | 'createdAt' | 'updatedAt';
    direction?: 'ASC' | 'DESC';
}
export declare class PaginationInput {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
//# sourceMappingURL=product.types.d.ts.map