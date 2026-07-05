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
import { Resolver, Query, Mutation, Arg, Ctx, Authorized, } from 'type-graphql';
import { UserRepository } from '../auth.repository.js';
import { UserType, LoginResponseType, RefreshTokenResponse, RegisterInputType, LoginInputType, } from './auth.types.graphql.js';
import { register, loginWithCredentials, refreshToken, logout } from '../auth.service.js';
let AuthResolver = class AuthResolver {
    async login(input, context) {
        const result = await loginWithCredentials(input.email, input.password, context.db);
        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
            user: this.mapUser(result.user),
        };
    }
    async register(input, context) {
        const user = await this.registerUser(context.db, input);
        const result = await loginWithCredentials(input.email, input.password, context.db);
        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
            user: this.mapUser(user),
        };
    }
    async registerUser(db, input) {
        return register(db, {
            email: input.email,
            password: input.password,
            firstName: input.firstName,
            lastName: input.lastName,
        });
    }
    async refreshToken(token, context) {
        const result = await refreshToken(context.db, token);
        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
        };
    }
    async logout(token, context) {
        if (token && context.user) {
            await logout(context.db, token);
        }
        return true;
    }
    async me(context) {
        if (!context.user)
            return null;
        const repo = new UserRepository(context.db);
        const user = await repo.findById(context.user.id);
        if (!user)
            return null;
        return this.mapUser(user);
    }
    mapUser(user) {
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
};
__decorate([
    Mutation(() => LoginResponseType),
    __param(0, Arg('input')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInputType, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    Mutation(() => LoginResponseType),
    __param(0, Arg('input')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInputType, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
__decorate([
    Mutation(() => RefreshTokenResponse),
    __param(0, Arg('token')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshToken", null);
__decorate([
    Mutation(() => Boolean),
    Authorized(),
    __param(0, Arg('token', () => String, { nullable: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
__decorate([
    Query(() => UserType, { nullable: true }),
    Authorized(),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "me", null);
AuthResolver = __decorate([
    Resolver(() => UserType)
], AuthResolver);
export { AuthResolver };
//# sourceMappingURL=auth.resolver.js.map