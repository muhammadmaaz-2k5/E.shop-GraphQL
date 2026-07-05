import { Sequelize, Op } from 'sequelize';
import DataLoader from 'dataloader';
import { createLogger } from '../../shared/infrastructure/logger/index.js';
import { NotFoundError, ValidationError, DatabaseError } from '../../shared/graphql/errors/index.js';
import { slugify } from '../../shared/utils/index.js';
import { Product as ProductModel, Category as CategoryModel, Brand as BrandModel } from '../../shared/infrastructure/database/index.js';
import type { Product, Category, Brand, ProductFilterInput, ProductSortInput, ConnectionCursor } from './product.types.js';
import type { CreateProductInput, PaginationInput } from './product.types.js';

const log = createLogger('product-service');

// Repository pattern - Products
export class ProductRepository {
  constructor(private db: Sequelize) {}

  async findById(id: string): Promise<Product | null> {
    try {
      const data = await ProductModel.findByPk(id, {
        include: [
          { model: CategoryModel, as: 'category' },
          { model: BrandModel, as: 'brand' }
        ]
      });
      return data ? this.mapProduct(data) : null;
    } catch (error) {
      log.error({ error, id }, 'Failed to fetch product');
      throw new DatabaseError('Failed to fetch product');
    }
  }

  async findBySlug(slug: string): Promise<Product | null> {
    try {
      const data = await ProductModel.findOne({ where: { slug } });
      return data ? this.mapProduct(data) : null;
    } catch (error) {
      log.error({ error, slug }, 'Failed to fetch product by slug');
      throw new DatabaseError('Failed to fetch product');
    }
  }

  async findBySku(sku: string): Promise<Product | null> {
    try {
      const data = await ProductModel.findOne({ where: { sku } });
      return data ? this.mapProduct(data) : null;
    } catch (error) {
      log.error({ error, sku }, 'Failed to fetch product by SKU');
      throw new DatabaseError('Failed to fetch product');
    }
  }

  async findMany(params: {
    filter?: ProductFilterInput;
    sort?: ProductSortInput;
    pagination?: PaginationInput;
  }): Promise<ConnectionCursor<Product>> {
    const { filter, sort, pagination } = params;

    try {
      const where: any = {};
      if (filter) {
        if (filter.categoryId) where.categoryId = filter.categoryId;
        if (filter.brandId) where.brandId = filter.brandId;
        if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;
        if (filter.isNew !== undefined) where.isNew = filter.isNew;
        if (filter.isActive !== undefined) where.isActive = filter.isActive;
        if (filter.minPrice !== undefined) where.price = { [Op.gte]: filter.minPrice };
        if (filter.maxPrice !== undefined) where.price = { ...(where.price || {}), [Op.lte]: filter.maxPrice };
        if (filter.search) {
          where[Op.and] = Sequelize.literal(`to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${this.db.escape(filter.search)})`);
        }
      }

      const limit = pagination?.first || pagination?.last || 20;
      const after = pagination?.after ? Buffer.from(pagination.after, 'base64').toString() : null;

      if (after) {
        where.createdAt = { [Op.gt]: new Date(after) };
      }

      const sortField = sort?.field || 'createdAt';
      const ascending = sort?.direction !== 'DESC';
      const orderField = sortField;

      const { rows, count } = await ProductModel.findAndCountAll({
        where,
        order: [[orderField, ascending ? 'ASC' : 'DESC']],
        limit: limit + 1,
        include: [
          { model: CategoryModel, as: 'category' },
          { model: BrandModel, as: 'brand' }
        ]
      });

      const nodes = rows.map(r => this.mapProduct(r));
      const hasNextPage = nodes.length > limit;

      if (hasNextPage) {
        nodes.pop();
      }

      const edges = nodes.map(node => ({
        node,
        cursor: Buffer.from(node.createdAt.toISOString()).toString('base64'),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: edges[0]?.cursor,
          endCursor: edges[edges.length - 1]?.cursor,
        },
        totalCount: count,
      };
    } catch (error) {
      log.error({ error, filter }, 'Failed to fetch products');
      throw new DatabaseError('Failed to fetch products');
    }
  }

  async create(input: CreateProductInput): Promise<Product> {
    const slug = input.slug || slugify(input.name);

    // Check for duplicate SKU
    const existing = await this.findBySku(input.sku);
    if (existing) {
      throw new ValidationError('SKU already exists', { field: 'sku' });
    }

    try {
      const data = await ProductModel.create({
        name: input.name,
        slug,
        sku: input.sku,
        price: input.price,
        compareAtPrice: input.compareAtPrice,
        costPrice: input.costPrice,
        description: input.description,
        shortDescription: input.shortDescription,
        categoryId: input.categoryId,
        brandId: input.brandId,
        images: input.images || [],
        isFeatured: input.isFeatured || false,
        isNew: input.isNew || false,
        isActive: true,
      });

      log.info({ productId: data.id, sku: input.sku }, 'Product created');
      return this.mapProduct(data);
    } catch (error: any) {
      log.error({ error, input }, 'Failed to create product');
      throw new DatabaseError('Failed to create product', { originalError: error.message });
    }
  }

  async update(id: string, input: Partial<CreateProductInput>): Promise<Product> {
    try {
      const product = await ProductModel.findByPk(id);
      if (!product) {
        throw new NotFoundError('Product', id);
      }

      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.compareAtPrice !== undefined) updateData.compareAtPrice = input.compareAtPrice;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
      if (input.brandId !== undefined) updateData.brandId = input.brandId;
      if (input.images !== undefined) updateData.images = input.images;
      if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;
      if (input.isNew !== undefined) updateData.isNew = input.isNew;

      if ('isActive' in input && input.isActive !== undefined) {
        updateData.isActive = input.isActive;
      }

      await product.update(updateData);
      log.info({ productId: id }, 'Product updated');
      return this.mapProduct(product);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      log.error({ error, id, input }, 'Failed to update product');
      throw new DatabaseError('Failed to update product');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const count = await ProductModel.destroy({ where: { id } });
      if (count === 0) {
        throw new NotFoundError('Product', id);
      }
      log.info({ productId: id }, 'Product deleted');
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      log.error({ error, id }, 'Failed to delete product');
      throw new DatabaseError('Failed to delete product');
    }
  }

  private mapProduct(data: ProductModel): Product {
    const json = data.toJSON() as any;
    return {
      id: json.id,
      name: json.name,
      slug: json.slug,
      description: json.description,
      shortDescription: json.shortDescription,
      sku: json.sku,
      price: json.price,
      compareAtPrice: json.compareAtPrice ?? undefined,
      costPrice: json.costPrice ?? undefined,
      categoryId: json.categoryId ?? undefined,
      brandId: json.brandId ?? undefined,
      images: Array.isArray(json.images) ? json.images : [],
      thumbnailUrl: json.thumbnailUrl ?? undefined,
      isActive: json.isActive,
      isFeatured: json.isFeatured,
      isNew: json.isNew,
      weight: json.weight ?? undefined,
      dimensions: json.dimensions || { length: 0, width: 0, height: 0 },
      metaTitle: json.metaTitle ?? undefined,
      metaDescription: json.metaDescription ?? undefined,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    };
  }
}

// Repository pattern - Categories
export class CategoryRepository {
  constructor(_db: Sequelize) {}

  async findById(id: string): Promise<Category | null> {
    try {
      const data = await CategoryModel.findByPk(id);
      return data ? this.mapCategory(data) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch category');
    }
  }

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const data = await CategoryModel.findOne({ where: { slug } });
      return data ? this.mapCategory(data) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch category');
    }
  }

  async findAll(activeOnly = true): Promise<Category[]> {
    try {
      const where = activeOnly ? { isActive: true } : {};
      const data = await CategoryModel.findAll({
        where,
        order: [['sortOrder', 'ASC']]
      });
      return data.map(this.mapCategory);
    } catch (error) {
      throw new DatabaseError('Failed to fetch categories');
    }
  }

  async getChildren(parentId: string): Promise<Category[]> {
    try {
      const data = await CategoryModel.findAll({
        where: { parentId, isActive: true },
        order: [['sortOrder', 'ASC']]
      });
      return data.map(this.mapCategory);
    } catch (error) {
      throw new DatabaseError('Failed to fetch child categories');
    }
  }

  async getParent(categoryId: string): Promise<Category | null> {
    try {
      const category = await CategoryModel.findByPk(categoryId, {
        include: [{ model: CategoryModel, as: 'parent' }]
      });
      return category?.parent ? this.mapCategory(category.parent) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch parent category');
    }
  }

  private mapCategory(data: CategoryModel): Category {
    const json = data.toJSON() as any;
    return {
      id: json.id,
      name: json.name,
      slug: json.slug,
      description: json.description ?? undefined,
      imageUrl: json.imageUrl ?? undefined,
      parentId: json.parentId ?? undefined,
      isActive: json.isActive,
      sortOrder: json.sortOrder,
      metaTitle: json.metaTitle ?? undefined,
      metaDescription: json.metaDescription ?? undefined,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    };
  }
}

// Repository pattern - Brands
export class BrandRepository {
  constructor(_db: Sequelize) {}

  async findById(id: string): Promise<Brand | null> {
    try {
      const data = await BrandModel.findByPk(id);
      return data ? this.mapBrand(data) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch brand');
    }
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    try {
      const data = await BrandModel.findOne({ where: { slug } });
      return data ? this.mapBrand(data) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch brand');
    }
  }

  async findAll(activeOnly = true): Promise<Brand[]> {
    try {
      const where = activeOnly ? { isActive: true } : {};
      const data = await BrandModel.findAll({
        where,
        order: [['name', 'ASC']]
      });
      return data.map(this.mapBrand);
    } catch (error) {
      throw new DatabaseError('Failed to fetch brands');
    }
  }

  private mapBrand(data: BrandModel): Brand {
    const json = data.toJSON() as any;
    return {
      id: json.id,
      name: json.name,
      slug: json.slug,
      description: json.description ?? undefined,
      logoUrl: json.logoUrl ?? undefined,
      isActive: json.isActive,
      websiteUrl: json.websiteUrl ?? undefined,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    };
  }
}

// DataLoader factory for N+1 query prevention
export function createProductLoaders(db: Sequelize) {
  return {
    productById: new DataLoader<string, Product | null>(async (ids) => {
      const repo = new ProductRepository(db);
      const products = await Promise.all(ids.map(id => repo.findById(id)));
      return products;
    }),

    categoryById: new DataLoader<string, Category | null>(async (ids) => {
      const repo = new CategoryRepository(db);
      const categories = await Promise.all(ids.map(id => repo.findById(id)));
      return categories;
    }),

    brandById: new DataLoader<string, Brand | null>(async (ids) => {
      const repo = new BrandRepository(db);
      const brands = await Promise.all(ids.map(id => repo.findById(id)));
      return brands;
    }),
  };
}

export type ProductLoaders = ReturnType<typeof createProductLoaders>;
