import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';
import { z } from 'zod';

// DTOs for input validation
export class RegisterInput {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(100)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;
}

export class LoginInput {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshTokenInput {
  @IsString()
  refreshToken!: string;
}

export class ChangePasswordInput {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  newPassword!: string;
}

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

// Domain types
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
