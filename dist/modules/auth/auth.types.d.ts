import { z } from 'zod';
export declare class RegisterInput {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export declare class LoginInput {
    email: string;
    password: string;
}
export declare class RefreshTokenInput {
    refreshToken: string;
}
export declare class ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
}, {
    password: string;
    email: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
    iat: number;
    exp: number;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface User {
    id: string;
    email: string;
    role: 'admin' | 'manager' | 'customer';
    permissions: string[];
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    phone?: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=auth.types.d.ts.map