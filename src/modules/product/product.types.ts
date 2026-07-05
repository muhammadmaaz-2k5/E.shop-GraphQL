import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, Min, Max, IsUUID, Length } from 'class-validator';

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

// Pagination
export interface ConnectionCursor<T> {
  edges: Array<{ node: T; cursor: string }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

// DTOs
export class CreateProductInput {
  @IsString() @Length(1, 200)
  name!: string;

  @IsString() @IsOptional() @Length(1, 250)
  slug?: string;

  @IsString() @Length(1, 100)
  sku!: string;

  @IsNumber() @Min(0)
  price!: number;

  @IsNumber() @Min(0) @IsOptional()
  compareAtPrice?: number;

  @IsNumber() @Min(0) @IsOptional()
  costPrice?: number;

  @IsString() @IsOptional()
  description?: string;

  @IsString() @IsOptional() @Length(0, 300)
  shortDescription?: string;

  @IsUUID() @IsOptional()
  categoryId?: string;

  @IsUUID() @IsOptional()
  brandId?: string;

  @IsArray() @IsOptional()
  images?: ProductImage[];

  @IsBoolean() @IsOptional()
  isFeatured?: boolean;

  @IsBoolean() @IsOptional()
  isNew?: boolean;
}

export class UpdateProductInput {
  @IsUUID()
  id!: string;

  @IsString() @IsOptional() @Length(1, 200)
  name?: string;

  @IsString() @IsOptional() @Length(1, 250)
  slug?: string;

  @IsNumber() @Min(0) @IsOptional()
  price?: number;

  @IsBoolean() @IsOptional()
  isActive?: boolean;

  @IsBoolean() @IsOptional()
  isFeatured?: boolean;

  @IsString() @IsOptional()
  description?: string;

  @IsUUID() @IsOptional()
  categoryId?: string;

  @IsUUID() @IsOptional()
  brandId?: string;

  @IsArray() @IsOptional()
  images?: ProductImage[];
}

export class ProductFilterInput {
  @IsUUID() @IsOptional()
  categoryId?: string;

  @IsUUID() @IsOptional()
  brandId?: string;

  @IsBoolean() @IsOptional()
  isFeatured?: boolean;

  @IsBoolean() @IsOptional()
  isNew?: boolean;

  @IsBoolean() @IsOptional()
  isActive?: boolean;

  @IsNumber() @Min(0) @IsOptional()
  minPrice?: number;

  @IsNumber() @Min(0) @IsOptional()
  maxPrice?: number;

  @IsString() @IsOptional()
  search?: string;
}

export class ProductSortInput {
  @IsString() @IsOptional()
  field?: 'name' | 'price' | 'createdAt' | 'updatedAt';

  @IsString() @IsOptional()
  direction?: 'ASC' | 'DESC';
}

export class PaginationInput {
  @IsNumber() @Min(1) @Max(100) @IsOptional()
  first?: number;

  @IsString() @IsOptional()
  after?: string;

  @IsNumber() @Min(1) @Max(100) @IsOptional()
  last?: number;

  @IsString() @IsOptional()
  before?: string;
}
