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
import { Resolver, Query, Mutation, Arg, Ctx, FieldResolver, Root, InputType, Field, ObjectType, Int, ID, Authorized, } from 'type-graphql';
import { ProductRepository, CategoryRepository, BrandRepository } from '../product.service.js';
import { DateTimeScalar } from '../../../shared/graphql/scalars/index.js';
let ProductImage = class ProductImage {
    url;
    alt;
    sortOrder;
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ProductImage.prototype, "url", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductImage.prototype, "alt", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductImage.prototype, "sortOrder", void 0);
ProductImage = __decorate([
    ObjectType()
], ProductImage);
let ProductImageInput = class ProductImageInput {
    url;
    alt;
    sortOrder;
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ProductImageInput.prototype, "url", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductImageInput.prototype, "alt", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductImageInput.prototype, "sortOrder", void 0);
ProductImageInput = __decorate([
    InputType()
], ProductImageInput);
let ProductDimensions = class ProductDimensions {
    length;
    width;
    height;
};
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], ProductDimensions.prototype, "length", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], ProductDimensions.prototype, "width", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], ProductDimensions.prototype, "height", void 0);
ProductDimensions = __decorate([
    ObjectType()
], ProductDimensions);
let ProductType = class ProductType {
    id;
    name;
    slug;
    description;
    shortDescription;
    sku;
    price;
    compareAtPrice;
    costPrice;
    categoryId;
    brandId;
    images;
    thumbnailUrl;
    isActive;
    isFeatured;
    isNew;
    weight;
    dimensions;
    createdAt;
    updatedAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], ProductType.prototype, "id", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ProductType.prototype, "name", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ProductType.prototype, "slug", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductType.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductType.prototype, "shortDescription", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ProductType.prototype, "sku", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], ProductType.prototype, "price", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], ProductType.prototype, "compareAtPrice", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], ProductType.prototype, "costPrice", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductType.prototype, "categoryId", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], ProductType.prototype, "brandId", void 0);
__decorate([
    Field(() => [ProductImage]),
    __metadata("design:type", Array)
], ProductType.prototype, "images", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductType.prototype, "thumbnailUrl", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], ProductType.prototype, "isActive", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], ProductType.prototype, "isFeatured", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], ProductType.prototype, "isNew", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], ProductType.prototype, "weight", void 0);
__decorate([
    Field(() => ProductDimensions),
    __metadata("design:type", ProductDimensions)
], ProductType.prototype, "dimensions", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], ProductType.prototype, "createdAt", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], ProductType.prototype, "updatedAt", void 0);
ProductType = __decorate([
    ObjectType()
], ProductType);
let CategoryType = class CategoryType {
    id;
    name;
    slug;
    description;
    imageUrl;
    parentId;
    isActive;
    sortOrder;
    createdAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], CategoryType.prototype, "id", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CategoryType.prototype, "name", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CategoryType.prototype, "slug", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CategoryType.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CategoryType.prototype, "imageUrl", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], CategoryType.prototype, "parentId", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], CategoryType.prototype, "isActive", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], CategoryType.prototype, "sortOrder", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], CategoryType.prototype, "createdAt", void 0);
CategoryType = __decorate([
    ObjectType()
], CategoryType);
let BrandType = class BrandType {
    id;
    name;
    slug;
    description;
    logoUrl;
    isActive;
    createdAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], BrandType.prototype, "id", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], BrandType.prototype, "name", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], BrandType.prototype, "slug", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], BrandType.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], BrandType.prototype, "logoUrl", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], BrandType.prototype, "isActive", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], BrandType.prototype, "createdAt", void 0);
BrandType = __decorate([
    ObjectType()
], BrandType);
let PageInfo = class PageInfo {
    hasNextPage;
    hasPreviousPage;
    startCursor;
    endCursor;
};
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], PageInfo.prototype, "hasNextPage", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], PageInfo.prototype, "hasPreviousPage", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PageInfo.prototype, "startCursor", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PageInfo.prototype, "endCursor", void 0);
PageInfo = __decorate([
    ObjectType()
], PageInfo);
let ProductEdge = class ProductEdge {
    node;
    cursor;
};
__decorate([
    Field(() => ProductType),
    __metadata("design:type", ProductType)
], ProductEdge.prototype, "node", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ProductEdge.prototype, "cursor", void 0);
ProductEdge = __decorate([
    ObjectType()
], ProductEdge);
let ProductConnection = class ProductConnection {
    edges;
    pageInfo;
    totalCount;
};
__decorate([
    Field(() => [ProductEdge]),
    __metadata("design:type", Array)
], ProductConnection.prototype, "edges", void 0);
__decorate([
    Field(() => PageInfo),
    __metadata("design:type", PageInfo)
], ProductConnection.prototype, "pageInfo", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ProductConnection.prototype, "totalCount", void 0);
ProductConnection = __decorate([
    ObjectType()
], ProductConnection);
let ProductFilter = class ProductFilter {
    categoryId;
    brandId;
    isFeatured;
    isNew;
    search;
    minPrice;
    maxPrice;
};
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], ProductFilter.prototype, "categoryId", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], ProductFilter.prototype, "brandId", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], ProductFilter.prototype, "isFeatured", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], ProductFilter.prototype, "isNew", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductFilter.prototype, "search", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], ProductFilter.prototype, "minPrice", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], ProductFilter.prototype, "maxPrice", void 0);
ProductFilter = __decorate([
    InputType()
], ProductFilter);
let ProductSort = class ProductSort {
    field;
    direction;
};
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductSort.prototype, "field", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductSort.prototype, "direction", void 0);
ProductSort = __decorate([
    InputType()
], ProductSort);
let Pagination = class Pagination {
    first;
    after;
    last;
    before;
};
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], Pagination.prototype, "first", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], Pagination.prototype, "after", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], Pagination.prototype, "last", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], Pagination.prototype, "before", void 0);
Pagination = __decorate([
    InputType()
], Pagination);
let CreateProduct = class CreateProduct {
    name;
    slug;
    sku;
    price;
    compareAtPrice;
    description;
    categoryId;
    brandId;
    images;
    isFeatured;
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateProduct.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateProduct.prototype, "slug", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateProduct.prototype, "sku", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], CreateProduct.prototype, "price", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], CreateProduct.prototype, "compareAtPrice", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateProduct.prototype, "description", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], CreateProduct.prototype, "categoryId", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], CreateProduct.prototype, "brandId", void 0);
__decorate([
    Field(() => [ProductImageInput], { nullable: true }),
    __metadata("design:type", Array)
], CreateProduct.prototype, "images", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], CreateProduct.prototype, "isFeatured", void 0);
CreateProduct = __decorate([
    InputType()
], CreateProduct);
let UpdateProduct = class UpdateProduct {
    id;
    name;
    price;
    isActive;
    isFeatured;
    description;
    categoryId;
    brandId;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], UpdateProduct.prototype, "id", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateProduct.prototype, "name", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], UpdateProduct.prototype, "price", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], UpdateProduct.prototype, "isActive", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], UpdateProduct.prototype, "isFeatured", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateProduct.prototype, "description", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], UpdateProduct.prototype, "categoryId", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], UpdateProduct.prototype, "brandId", void 0);
UpdateProduct = __decorate([
    InputType()
], UpdateProduct);
let ProductResolver = class ProductResolver {
    async product(id, ctx) {
        const repo = new ProductRepository(ctx.db);
        const product = await repo.findById(id);
        return product ? this.mapProduct(product) : null;
    }
    async productBySlug(slug, ctx) {
        const repo = new ProductRepository(ctx.db);
        const product = await repo.findBySlug(slug);
        return product ? this.mapProduct(product) : null;
    }
    async products(filter, sort, pagination, ctx) {
        const repo = new ProductRepository(ctx.db);
        const result = await repo.findMany({ filter, sort, pagination });
        return {
            edges: result.edges.map(e => ({
                node: this.mapProduct(e.node),
                cursor: e.cursor,
            })),
            pageInfo: result.pageInfo,
            totalCount: result.totalCount,
        };
    }
    async createProduct(input, ctx) {
        const repo = new ProductRepository(ctx.db);
        const product = await repo.create(input);
        return this.mapProduct(product);
    }
    async updateProduct(input, ctx) {
        const repo = new ProductRepository(ctx.db);
        const updated = { ...input, isActive: input.isActive };
        const product = await repo.update(input.id, updated);
        return this.mapProduct(product);
    }
    async deleteProduct(id, ctx) {
        const repo = new ProductRepository(ctx.db);
        await repo.delete(id);
        return true;
    }
    async category(product, ctx) {
        if (!product.categoryId)
            return null;
        const loader = ctx.loaders.categoryById;
        const category = await loader.load(product.categoryId);
        return category ? this.mapCategory(category) : null;
    }
    async brand(product, ctx) {
        if (!product.brandId)
            return null;
        const loader = ctx.loaders.brandById;
        const brand = await loader.load(product.brandId);
        return brand ? this.mapBrand(brand) : null;
    }
    mapProduct(p) {
        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            shortDescription: p.shortDescription,
            sku: p.sku,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            costPrice: p.costPrice,
            categoryId: p.categoryId,
            brandId: p.brandId,
            images: p.images,
            thumbnailUrl: p.thumbnailUrl,
            isActive: p.isActive,
            isFeatured: p.isFeatured,
            isNew: p.isNew,
            weight: p.weight,
            dimensions: p.dimensions,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        };
    }
    mapCategory(c) {
        return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            imageUrl: c.imageUrl,
            parentId: c.parentId,
            isActive: c.isActive,
            sortOrder: c.sortOrder,
            createdAt: c.createdAt,
        };
    }
    mapBrand(b) {
        return {
            id: b.id,
            name: b.name,
            slug: b.slug,
            description: b.description,
            logoUrl: b.logoUrl,
            isActive: b.isActive,
            createdAt: b.createdAt,
        };
    }
};
__decorate([
    Query(() => ProductType, { nullable: true }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "product", null);
__decorate([
    Query(() => ProductType, { nullable: true }),
    __param(0, Arg('slug')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "productBySlug", null);
__decorate([
    Query(() => ProductConnection),
    __param(0, Arg('filter', () => ProductFilter, { nullable: true })),
    __param(1, Arg('sort', () => ProductSort, { nullable: true })),
    __param(2, Arg('pagination', () => Pagination, { nullable: true })),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductFilter,
        ProductSort,
        Pagination, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "products", null);
__decorate([
    Mutation(() => ProductType),
    Authorized(['admin', 'manager']),
    __param(0, Arg('input', () => CreateProduct)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProduct, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createProduct", null);
__decorate([
    Mutation(() => ProductType),
    Authorized(['admin', 'manager']),
    __param(0, Arg('input', () => UpdateProduct)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateProduct, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "updateProduct", null);
__decorate([
    Mutation(() => Boolean),
    Authorized(['admin']),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
__decorate([
    FieldResolver(() => CategoryType, { nullable: true }),
    __param(0, Root()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductType, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "category", null);
__decorate([
    FieldResolver(() => BrandType, { nullable: true }),
    __param(0, Root()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductType, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "brand", null);
ProductResolver = __decorate([
    Resolver(() => ProductType)
], ProductResolver);
export { ProductResolver };
let CategoryResolver = class CategoryResolver {
    async category(id, ctx) {
        const repo = new CategoryRepository(ctx.db);
        const category = await repo.findById(id);
        return category ? this.mapCategory(category) : null;
    }
    async categories(ctx) {
        const repo = new CategoryRepository(ctx.db);
        const categories = await repo.findAll();
        return categories.map(this.mapCategory);
    }
    async parent(category, ctx) {
        if (!category.parentId)
            return null;
        const repo = new CategoryRepository(ctx.db);
        const parent = await repo.findById(category.parentId);
        return parent ? this.mapCategory(parent) : null;
    }
    async children(category, ctx) {
        const repo = new CategoryRepository(ctx.db);
        const children = await repo.getChildren(category.id);
        return children.map(this.mapCategory);
    }
    mapCategory(c) {
        return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            imageUrl: c.imageUrl,
            parentId: c.parentId,
            isActive: c.isActive,
            sortOrder: c.sortOrder,
            createdAt: c.createdAt,
        };
    }
};
__decorate([
    Query(() => CategoryType, { nullable: true }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "category", null);
__decorate([
    Query(() => [CategoryType]),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categories", null);
__decorate([
    FieldResolver(() => CategoryType, { nullable: true }),
    __param(0, Root()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryType, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "parent", null);
__decorate([
    FieldResolver(() => [CategoryType]),
    __param(0, Root()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryType, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "children", null);
CategoryResolver = __decorate([
    Resolver(() => CategoryType)
], CategoryResolver);
export { CategoryResolver };
let BrandResolver = class BrandResolver {
    async brand(id, ctx) {
        const repo = new BrandRepository(ctx.db);
        const brand = await repo.findById(id);
        return brand ? this.mapBrand(brand) : null;
    }
    async brands(ctx) {
        const repo = new BrandRepository(ctx.db);
        const brands = await repo.findAll();
        return brands.map(this.mapBrand);
    }
    mapBrand(b) {
        return {
            id: b.id,
            name: b.name,
            slug: b.slug,
            description: b.description,
            logoUrl: b.logoUrl,
            isActive: b.isActive,
            createdAt: b.createdAt,
        };
    }
};
__decorate([
    Query(() => BrandType, { nullable: true }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "brand", null);
__decorate([
    Query(() => [BrandType]),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "brands", null);
BrandResolver = __decorate([
    Resolver(() => BrandType)
], BrandResolver);
export { BrandResolver };
//# sourceMappingURL=product.resolver.js.map