import { GraphQLContext } from '../../../shared/graphql/context.js';
import { UserType, LoginResponseType, RefreshTokenResponse, RegisterInputType, LoginInputType } from './auth.types.graphql.js';
export declare class AuthResolver {
    login(input: LoginInputType, context: GraphQLContext): Promise<LoginResponseType>;
    register(input: RegisterInputType, context: GraphQLContext): Promise<LoginResponseType>;
    private registerUser;
    refreshToken(token: string, context: GraphQLContext): Promise<RefreshTokenResponse>;
    logout(token: string | null, context: GraphQLContext): Promise<boolean>;
    me(context: GraphQLContext): Promise<UserType | null>;
    private mapUser;
}
//# sourceMappingURL=auth.resolver.d.ts.map