import {
  ObjectType,
  Field,
  ID,
  InputType,
  FieldResolver,
  Resolver,
  Root,
} from 'type-graphql';
import { DateTimeScalar } from '../../../shared/graphql/scalars/index.js';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  role!: string;

  @Field(() => [String])
  permissions!: string[];

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => Boolean)
  emailVerified!: boolean;

  @Field(() => DateTimeScalar)
  createdAt!: Date;

  @Field(() => DateTimeScalar)
  updatedAt!: Date;
}

@ObjectType()
export class LoginResponseType {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;

  @Field(() => Number)
  expiresIn!: number;

  @Field(() => UserType)
  user!: UserType;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;

  @Field(() => Number)
  expiresIn!: number;
}

@InputType()
export class RegisterInputType {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;
}

@InputType()
export class LoginInputType {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@Resolver(() => UserType)
export class UserTypeResolver {
  @FieldResolver(() => String, { nullable: true })
  fullName(@Root() user: UserType): string | null {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return null;
  }
}
