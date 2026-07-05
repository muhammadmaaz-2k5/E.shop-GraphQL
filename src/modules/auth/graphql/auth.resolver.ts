import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from 'type-graphql';
import { GraphQLContext } from '../../../shared/graphql/context.js';
import { UserRepository } from '../auth.repository.js';
import {
  UserType,
  LoginResponseType,
  RefreshTokenResponse,
  RegisterInputType,
  LoginInputType,
} from './auth.types.graphql.js';
import { register, loginWithCredentials, refreshToken, logout } from '../auth.service.js';

@Resolver(() => UserType)
export class AuthResolver {
  @Mutation(() => LoginResponseType)
  async login(
    @Arg('input', () => LoginInputType) input: LoginInputType,
    @Ctx() context: GraphQLContext
  ): Promise<LoginResponseType> {
    const result = await loginWithCredentials(input.email, input.password, context.db);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: this.mapUser(result.user),
    };
  }

  @Mutation(() => LoginResponseType)
  async register(
    @Arg('input', () => RegisterInputType) input: RegisterInputType,
    @Ctx() context: GraphQLContext
  ): Promise<LoginResponseType> {
    const user = await this.registerUser(context.db, input);
    const result = await loginWithCredentials(input.email, input.password, context.db);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: this.mapUser(user),
    };
  }

  private async registerUser(db: any, input: RegisterInputType): Promise<any> {
    return register(db, {
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    });
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Arg('token', () => String) token: string,
    @Ctx() context: GraphQLContext
  ): Promise<RefreshTokenResponse> {
    const result = await refreshToken(context.db, token);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };
  }

  @Mutation(() => Boolean)
  @Authorized()
  async logout(
    @Arg('token', () => String, { nullable: true }) token: string | null,
    @Ctx() context: GraphQLContext
  ): Promise<boolean> {
    if (token && context.user) {
      await logout(context.db, token);
    }
    return true;
  }

  @Query(() => UserType, { nullable: true })
  @Authorized()
  async me(@Ctx() context: GraphQLContext): Promise<UserType | null> {
    if (!context.user) return null;

    const repo = new UserRepository(context.db);
    const user = await repo.findById(context.user.id);

    if (!user) return null;
    return this.mapUser(user);
  }

  private mapUser(user: any): UserType {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
