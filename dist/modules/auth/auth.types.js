var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';
import { z } from 'zod';
// DTOs for input validation
export class RegisterInput {
    email;
    password;
    firstName;
    lastName;
}
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    IsString(),
    MinLength(8, { message: 'Password must be at least 8 characters' }),
    MaxLength(100),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(50),
    __metadata("design:type", String)
], RegisterInput.prototype, "firstName", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(50),
    __metadata("design:type", String)
], RegisterInput.prototype, "lastName", void 0);
export class LoginInput {
    email;
    password;
}
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
export class RefreshTokenInput {
    refreshToken;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], RefreshTokenInput.prototype, "refreshToken", void 0);
export class ChangePasswordInput {
    currentPassword;
    newPassword;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], ChangePasswordInput.prototype, "currentPassword", void 0);
__decorate([
    IsString(),
    MinLength(8, { message: 'New password must be at least 8 characters' }),
    __metadata("design:type", String)
], ChangePasswordInput.prototype, "newPassword", void 0);
// Zod schemas for additional validation
export const RegisterSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
});
export const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=auth.types.js.map