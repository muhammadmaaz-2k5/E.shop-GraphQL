import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  ObjectType,
  Int,
  ID,
  FieldResolver,
  Root,
} from 'type-graphql';
import { GraphQLContext, requireAuth } from '../shared/graphql/context.js';
import { CartRepository, Cart } from '../modules/cart/index.js';
import { DateTimeScalar } from '../shared/graphql/scalars/index.js';
import { ProductType } from '../modules/product/graphql/product.resolver.js';

@ObjectType()
export class CartItemType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  productId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Number)
  unitPrice!: number;

  @Field(() => Number)
  totalPrice!: number;

  @Field(() => ProductType, { nullable: true })
  product?: ProductType;
}

@ObjectType()
class CartType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => Number)
  subtotal!: number;

  @Field(() => Number)
  discountAmount!: number;

  @Field(() => Number)
  taxAmount!: number;

  @Field(() => Number)
  shippingAmount!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [CartItemType])
  items!: CartItemType[];

  @Field(() => Int)
  itemCount!: number;

  @Field(() => DateTimeScalar)
  createdAt!: Date;

  @Field(() => DateTimeScalar)
  updatedAt!: Date;
}

@InputType()
class AddToCartInput {
  @Field(() => ID)
  productId!: string;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
class UpdateCartItemInput {
  @Field(() => ID)
  itemId!: string;

  @Field(() => Int)
  quantity!: number;
}

@Resolver(() => CartType)
export class CartResolver {
  @Query(() => CartType, { nullable: true })
  async cart(@Ctx() ctx: GraphQLContext): Promise<CartType | null> {
    if (!ctx.user) return null;
    const repo = new CartRepository(ctx.db);
    const cart = await repo.getOrCreateCart(ctx.user.id);
    return this.mapCart(cart);
  }

  @Mutation(() => CartType)
  async addToCart(@Arg('input', () => AddToCartInput) input: AddToCartInput, @Ctx() ctx: GraphQLContext): Promise<CartType> {
    const user = requireAuth(ctx);
    const repo = new CartRepository(ctx.db);
    const cart = await repo.addItem(user.id, input.productId, input.quantity);
    return this.mapCart(cart);
  }

  @Mutation(() => CartType)
  async updateCartItem(@Arg('input', () => UpdateCartItemInput) input: UpdateCartItemInput, @Ctx() ctx: GraphQLContext): Promise<CartType> {
    const user = requireAuth(ctx);
    const repo = new CartRepository(ctx.db);
    const cart = await repo.updateItemQuantity(user.id, input.itemId, input.quantity);
    return this.mapCart(cart);
  }

  @Mutation(() => Boolean)
  async removeFromCart(@Arg('itemId', () => ID) itemId: string, @Ctx() ctx: GraphQLContext): Promise<boolean> {
    const user = requireAuth(ctx);
    const repo = new CartRepository(ctx.db);
    await repo.removeItem(user.id, itemId);
    return true;
  }

  @Mutation(() => Boolean)
  async clearCart(@Ctx() ctx: GraphQLContext): Promise<boolean> {
    const user = requireAuth(ctx);
    const repo = new CartRepository(ctx.db);
    await repo.clearCart(user.id);
    return true;
  }

  private mapCart(cart: Cart): CartType {
    return {
      id: cart.id,
      userId: cart.userId,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      taxAmount: cart.taxAmount,
      shippingAmount: cart.shippingAmount,
      total: cart.total,
      items: cart.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}

@Resolver(() => CartItemType)
export class CartItemResolver {
  @FieldResolver(() => ProductType, { nullable: true })
  async product(@Root() item: CartItemType, @Ctx() ctx: GraphQLContext): Promise<ProductType | null> {
    return ctx.loaders.productById.load(item.productId);
  }
}

