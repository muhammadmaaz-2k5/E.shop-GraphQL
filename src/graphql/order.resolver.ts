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
  Subscription,
  Root,
  Authorized,
} from 'type-graphql';
import { GraphQLContext, requireAuth } from '../shared/graphql/context.js';
import { OrderRepository, Order, OrderStatus } from '../modules/order/index.js';
import { BusinessError, ErrorCode } from '../shared/graphql/errors/index.js';
import { DateTimeScalar } from '../shared/graphql/scalars/index.js';

@ObjectType()
class OrderAddressType {
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String)
  addressLine1!: string;

  @Field(() => String, { nullable: true })
  addressLine2?: string;

  @Field(() => String)
  city!: string;

  @Field(() => String)
  state!: string;

  @Field(() => String)
  postalCode!: string;

  @Field(() => String)
  country!: string;
}

@ObjectType()
class OrderItemType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  productId!: string;

  @Field(() => String)
  productName!: string;

  @Field(() => String)
  productSku!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Number)
  unitPrice!: number;

  @Field(() => Number)
  totalPrice!: number;
}

@ObjectType()
class OrderType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  orderNumber!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => String)
  status!: string;

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

  @Field(() => [OrderItemType])
  items!: OrderItemType[];

  @Field(() => OrderAddressType)
  shippingAddress!: OrderAddressType;

  @Field(() => OrderAddressType)
  billingAddress!: OrderAddressType;

  @Field(() => String, { nullable: true })
  trackingNumber?: string;

  @Field(() => DateTimeScalar)
  createdAt!: Date;

  @Field(() => DateTimeScalar)
  updatedAt!: Date;
}

@InputType()
class OrderAddressInput {
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String)
  addressLine1!: string;

  @Field(() => String, { nullable: true })
  addressLine2?: string;

  @Field(() => String)
  city!: string;

  @Field(() => String)
  state!: string;

  @Field(() => String)
  postalCode!: string;

  @Field(() => String)
  country!: string;
}

@InputType()
class CreateOrderInput {
  @Field(() => OrderAddressInput)
  shippingAddress!: OrderAddressInput;

  @Field(() => OrderAddressInput, { nullable: true })
  billingAddress?: OrderAddressInput;
}

@Resolver(() => OrderType)
export class OrderResolver {
  @Query(() => OrderType, { nullable: true })
  async order(@Arg('id', () => ID) id: string, @Ctx() ctx: GraphQLContext): Promise<OrderType | null> {
    const repo = new OrderRepository(ctx.db);
    const order = await repo.findById(id);

    if (!order) return null;
    if (order.userId !== ctx.user?.id && !ctx.isAdmin) {
      return null;
    }

    return this.mapOrder(order);
  }

  @Query(() => [OrderType])
  async orders(
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() ctx: GraphQLContext
  ): Promise<OrderType[]> {
    const user = requireAuth(ctx);
    const repo = new OrderRepository(ctx.db);
    const orders = await repo.findByUser(ctx.isAdmin && user ? user.id : ctx.user!.id, limit || 20);
    return orders.map(this.mapOrder);
  }

  @Mutation(() => OrderType)
  async createOrder(
    @Arg('input', () => CreateOrderInput) input: CreateOrderInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<OrderType> {
    const user = requireAuth(ctx);
    const repo = new OrderRepository(ctx.db);

    const order = await repo.create(user.id, input.shippingAddress, input.billingAddress);
    return this.mapOrder(order);
  }

  @Mutation(() => OrderType)
  async cancelOrder(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<OrderType> {
    const user = requireAuth(ctx);
    const repo = new OrderRepository(ctx.db);

    const existingOrder = await repo.findById(id);
    if (!existingOrder) {
      throw new BusinessError('Order not found', ErrorCode.NOT_FOUND);
    }

    if (existingOrder.userId !== user.id && !ctx.isAdmin) {
      throw new BusinessError('Not authorized to cancel this order', ErrorCode.FORBIDDEN);
    }

    const order = await repo.updateStatus(id, 'cancelled');
    return this.mapOrder(order);
  }

  @Mutation(() => OrderType)
  @Authorized(['admin', 'manager'])
  async updateOrderStatus(
    @Arg('id', () => ID) id: string,
    @Arg('status', () => String) status: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<OrderType> {
    const repo = new OrderRepository(ctx.db);
    const order = await repo.updateStatus(id, status as OrderStatus);
    return this.mapOrder(order);
  }

  @Subscription(() => OrderType, {
    topics: 'ORDER_UPDATED',
    filter: ({ payload, context }) => {
      const ctx = context as GraphQLContext;
      return ctx.user?.id === payload.userId || ctx.isAdmin;
    },
  })
  orderUpdated(@Root() order: OrderType): OrderType {
    return order;
  }

  @Subscription(() => OrderType, {
    topics: 'ORDER_CREATED',
    filter: ({ payload, context }) => {
      const ctx = context as GraphQLContext;
      return ctx.user?.id === payload.userId || ctx.isAdmin;
    },
  })
  orderCreated(@Root() order: OrderType): OrderType {
    return order;
  }

  private mapOrder(order: Order): OrderType {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      total: order.total,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      shippingAddress: order.shippingAddress as OrderAddressType,
      billingAddress: order.billingAddress as OrderAddressType,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
