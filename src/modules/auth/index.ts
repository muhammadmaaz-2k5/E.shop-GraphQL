import 'reflect-metadata';
import { LoginInput } from './auth.types.js';
import type { User, AuthTokens } from './auth.types.js';
import { loginWithCredentials, register, refreshToken, logout, getUserById } from './auth.service.js';
import type { RegisterInput } from './auth.service.js';
import { AuthResolver } from './graphql/auth.resolver.js';
import { UserTypeResolver } from './graphql/auth.types.graphql.js';
import { UserRepository } from './auth.repository.js';

export {
  LoginInput,
  AuthResolver,
  UserTypeResolver,
  UserRepository,
  loginWithCredentials,
  register,
  refreshToken,
  logout,
  getUserById,
};

export type { User, AuthTokens, RegisterInput };
