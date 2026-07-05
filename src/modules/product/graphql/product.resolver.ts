import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  InputType,
  Field,
  ObjectType,
  Int,
  ID,
  Authorized,
} from 'type-graphql';
import { GraphQLContext } from '../../../shared/graphql/context.js';
import { ProductRepository, CategoryRepository, BrandRepository } from '../product.service.js';
import type { Product, Category, Brand } from '../product.types.js';
import { DateTimeScalar } from '../../../shared/graphql/scalars/index.js';

@ObjectType()
class ProductImage {
  @Field(() => String)
  url!: string;

  @Field(() => String, { nullable: true })
  alt?: string;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;
}

@InputType()
class ProductImageInput {
  @Field(() => String)
  url!: string;

  @Field(() => String, { nullable: true })
  alt?: string;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;
}

@ObjectType()
class ProductDimensions {
  @Field(() => Number)
  length!: number;

  @Field(() => Number)
  width!: number;

  @Field(() => Number)
  height!: number;
}

@ObjectType()
class ProductType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  shortDescription?: string;

  @Field(() => String)
  sku!: string;

  @Field(() => Number)
  price!: number;

  @Field(() => Number, { nullable: true })
  compareAtPrice?: number;

  @Field(() => Number, { nullable: true })
  costPrice?: number;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  brandId?: string;

  @Field(() => [ProductImage])
  images!: ProductImage[];

  @Field(() => String, { nullable: true })
  thumbnailUrl?: string;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => Boolean)
  isFeatured!: boolean;

  @Field(() => Boolean)
  isNew!: boolean;

  @Field(() => Number, { nullable: true })
  weight?: number;

  @Field(() => ProductDimensions)
  dimensions!: ProductDimensions;

  @Field(() => DateTimeScalar)
  createdAt!: Date;

  @Field(() => DateTimeScalar)
  updatedAt!: Date;
}

@ObjectType()
class CategoryType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => DateTimeScalar)
  createdAt!: Date;
}

@ObjectType()
class BrandType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  logoUrl?: string;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => DateTimeScalar)
  createdAt!: Date;
}

@ObjectType()
class PageInfo {
  @Field(() => Boolean)
  hasNextPage!: boolean;

  @Field(() => Boolean)
  hasPreviousPage!: boolean;

  @Field(() => String, { nullable: true })
  startCursor?: string;

  @Field(() => String, { nullable: true })
  endCursor?: string;
}

@ObjectType()
class ProductEdge {
  @Field(() => ProductType)
  node!: ProductType;

  @Field(() => String)
  cursor!: string;
}

@ObjectType()
class ProductConnection {
  @Field(() => [ProductEdge])
  edges!: ProductEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;

  @Field(() => Int)
  totalCount!: number;
}

@InputType()
class ProductFilter {
  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  brandId?: string;

  @Field(() => Boolean, { nullable: true })
  isFeatured?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNew?: boolean;

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => Number, { nullable: true })
  minPrice?: number;

  @Field(() => Number, { nullable: true })
  maxPrice?: number;
}

@InputType()
class ProductSort {
  @Field(() => String, { nullable: true })
  field?: 'name' | 'price' | 'createdAt';

  @Field(() => String, { nullable: true })
  direction?: 'ASC' | 'DESC';
}

@InputType()
class Pagination {
  @Field(() => Int, { nullable: true })
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => Int, { nullable: true })
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@InputType()
class CreateProduct {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String)
  sku!: string;

  @Field(() => Number)
  price!: number;

  @Field(() => Number, { nullable: true })
  compareAtPrice?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  brandId?: string;

  @Field(() => [ProductImageInput], { nullable: true })
  images?: ProductImageInput[];

  @Field(() => Boolean, { nullable: true })
  isFeatured?: boolean;
}

@InputType()
class UpdateProduct {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Boolean, { nullable: true })
  isFeatured?: boolean;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  brandId?: string;
}

@Resolver(() => ProductType)
export class ProductResolver {
  @Query(() => ProductType, { nullable: true })
  async product(@Arg('id', () => ID) id: string, @Ctx() ctx: GraphQLContext): Promise<ProductType | null> {
    const repo = new ProductRepository(ctx.db);
    const product = await repo.findById(id);
    return product ? this.mapProduct(product) : null;
  }

  @Query(() => ProductType, { nullable: true })
  async productBySlug(@Arg('slug', () => String) slug: string, @Ctx() ctx: GraphQLContext): Promise<ProductType | null> {
    const repo = new ProductRepository(ctx.db);
    const product = await repo.findBySlug(slug);
    return product ? this.mapProduct(product) : null;
  }

  @Query(() => ProductConnection)
  async products(
    @Arg('filter', () => ProductFilter, { nullable: true }) filter: ProductFilter,
    @Arg('sort', () => ProductSort, { nullable: true }) sort: ProductSort,
    @Arg('pagination', () => Pagination, { nullable: true }) pagination: Pagination,
    @Ctx() ctx: GraphQLContext
  ): Promise<ProductConnection> {
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

  @Mutation(() => ProductType)
  @Authorized(['admin', 'manager'])
  async createProduct(
    @Arg('input', () => CreateProduct) input: CreateProduct,
    @Ctx() ctx: GraphQLContext
  ): Promise<ProductType> {
    const repo = new ProductRepository(ctx.db);
    const product = await repo.create(input);
    return this.mapProduct(product);
  }

  @Mutation(() => ProductType)
  @Authorized(['admin', 'manager'])
  async updateProduct(
    @Arg('input', () => UpdateProduct) input: UpdateProduct,
    @Ctx() ctx: GraphQLContext
  ): Promise<ProductType> {
    const repo = new ProductRepository(ctx.db);
    const updated: Partial<CreateProduct> = { ...input, isActive: input.isActive } as Partial<CreateProduct>;
    const product = await repo.update(input.id, updated);
    return this.mapProduct(product);
  }

  @Mutation(() => Boolean)
  @Authorized(['admin'])
  async deleteProduct(@Arg('id', () => ID) id: string, @Ctx() ctx: GraphQLContext): Promise<boolean> {
    const repo = new ProductRepository(ctx.db);
    await repo.delete(id);
    return true;
  }

  @FieldResolver(() => CategoryType, { nullable: true })
  async category(@Root() product: ProductType, @Ctx() ctx: GraphQLContext): Promise<CategoryType | null> {
    if (!product.categoryId) return null;
    const loader = ctx.loaders.categoryById;
    const category = await loader.load(product.categoryId) as Category | null;
    return category ? this.mapCategory(category) : null;
  }

  @FieldResolver(() => BrandType, { nullable: true })
  async brand(@Root() product: ProductType, @Ctx() ctx: GraphQLContext): Promise<BrandType | null> {
    if (!product.brandId) return null;
    const loader = ctx.loaders.brandById;
    const brand = await loader.load(product.brandId) as Brand | null;
    return brand ? this.mapBrand(brand) : null;
  }

  private mapProduct(p: Product): ProductType {
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

  private mapCategory(c: Category): CategoryType {
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

  private mapBrand(b: Brand): BrandType {
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
}

@Resolver(() => CategoryType)
export class CategoryResolver {
  @Query(() => CategoryType, { nullable: true })
  async category(@Arg('id', () => ID) id: string, @Ctx() ctx: GraphQLContext): Promise<CategoryType | null> {
    const repo = new CategoryRepository(ctx.db);
    const category = await repo.findById(id);
    return category ? this.mapCategory(category) : null;
  }

  @Query(() => [CategoryType])
  async categories(@Ctx() ctx: GraphQLContext): Promise<CategoryType[]> {
    const repo = new CategoryRepository(ctx.db);
    const categories = await repo.findAll();
    return categories.map(this.mapCategory);
  }

  @FieldResolver(() => CategoryType, { nullable: true })
  async parent(@Root() category: CategoryType, @Ctx() ctx: GraphQLContext): Promise<CategoryType | null> {
    if (!category.parentId) return null;
    const repo = new CategoryRepository(ctx.db);
    const parent = await repo.findById(category.parentId);
    return parent ? this.mapCategory(parent) : null;
  }

  @FieldResolver(() => [CategoryType])
  async children(@Root() category: CategoryType, @Ctx() ctx: GraphQLContext): Promise<CategoryType[]> {
    const repo = new CategoryRepository(ctx.db);
    const children = await repo.getChildren(category.id);
    return children.map(this.mapCategory);
  }

  private mapCategory(c: Category): CategoryType {
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
}

@Resolver(() => BrandType)
export class BrandResolver {
  @Query(() => BrandType, { nullable: true })
  async brand(@Arg('id', () => ID) id: string, @Ctx() ctx: GraphQLContext): Promise<BrandType | null> {
    const repo = new BrandRepository(ctx.db);
    const brand = await repo.findById(id);
    return brand ? this.mapBrand(brand) : null;
  }

  @Query(() => [BrandType])
  async brands(@Ctx() ctx: GraphQLContext): Promise<BrandType[]> {
    const repo = new BrandRepository(ctx.db);
    const brands = await repo.findAll();
    return brands.map(this.mapBrand);
  }

  private mapBrand(b: Brand): BrandType {
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
}
