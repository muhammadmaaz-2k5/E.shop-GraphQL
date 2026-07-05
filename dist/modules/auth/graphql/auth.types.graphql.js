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
import { ObjectType, Field, ID, InputType, FieldResolver, Resolver, Root, } from 'type-graphql';
import { DateTimeScalar } from '../../../shared/graphql/scalars/index.js';
let UserType = class UserType {
    id;
    email;
    role;
    permissions;
    firstName;
    lastName;
    avatarUrl;
    isActive;
    emailVerified;
    createdAt;
    updatedAt;
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], UserType.prototype, "id", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], UserType.prototype, "email", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], UserType.prototype, "role", void 0);
__decorate([
    Field(() => [String]),
    __metadata("design:type", Array)
], UserType.prototype, "permissions", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserType.prototype, "firstName", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserType.prototype, "lastName", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserType.prototype, "avatarUrl", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], UserType.prototype, "isActive", void 0);
__decorate([
    Field(() => Boolean),
    __metadata("design:type", Boolean)
], UserType.prototype, "emailVerified", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], UserType.prototype, "createdAt", void 0);
__decorate([
    Field(() => DateTimeScalar),
    __metadata("design:type", Date)
], UserType.prototype, "updatedAt", void 0);
UserType = __decorate([
    ObjectType()
], UserType);
export { UserType };
let LoginResponseType = class LoginResponseType {
    accessToken;
    refreshToken;
    expiresIn;
    user;
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], LoginResponseType.prototype, "accessToken", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], LoginResponseType.prototype, "refreshToken", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], LoginResponseType.prototype, "expiresIn", void 0);
__decorate([
    Field(() => UserType),
    __metadata("design:type", UserType)
], LoginResponseType.prototype, "user", void 0);
LoginResponseType = __decorate([
    ObjectType()
], LoginResponseType);
export { LoginResponseType };
let RefreshTokenResponse = class RefreshTokenResponse {
    accessToken;
    refreshToken;
    expiresIn;
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], RefreshTokenResponse.prototype, "accessToken", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], RefreshTokenResponse.prototype, "refreshToken", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], RefreshTokenResponse.prototype, "expiresIn", void 0);
RefreshTokenResponse = __decorate([
    ObjectType()
], RefreshTokenResponse);
export { RefreshTokenResponse };
let RegisterInputType = class RegisterInputType {
    email;
    password;
    firstName;
    lastName;
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], RegisterInputType.prototype, "email", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], RegisterInputType.prototype, "password", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RegisterInputType.prototype, "firstName", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RegisterInputType.prototype, "lastName", void 0);
RegisterInputType = __decorate([
    InputType()
], RegisterInputType);
export { RegisterInputType };
let LoginInputType = class LoginInputType {
    email;
    password;
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], LoginInputType.prototype, "email", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], LoginInputType.prototype, "password", void 0);
LoginInputType = __decorate([
    InputType()
], LoginInputType);
export { LoginInputType };
let UserTypeResolver = class UserTypeResolver {
    fullName(user) {
        if (user.firstName || user.lastName) {
            return `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        return null;
    }
};
__decorate([
    FieldResolver(() => String, { nullable: true }),
    __param(0, Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserType]),
    __metadata("design:returntype", Object)
], UserTypeResolver.prototype, "fullName", null);
UserTypeResolver = __decorate([
    Resolver(() => UserType)
], UserTypeResolver);
export { UserTypeResolver };
//# sourceMappingURL=auth.types.graphql.js.map