import 'reflect-metadata';
import { User, AuthTokens, LoginInput } from './auth.types.js';
import { loginWithCredentials, register, refreshToken, logout, getUserById, RegisterInput } from './auth.service.js';
import { AuthResolver } from './graphql/auth.resolver.js';
import { UserTypeResolver } from './graphql/auth.types.graphql.js';
import { UserRepository } from './auth.repository.js';

export {
  User,
  AuthTokens,
  LoginInput,
  AuthResolver,
  UserTypeResolver,
  UserRepository,
  loginWithCredentials,
  register,
  refreshToken,
  logout,
  getUserById,
  RegisterInput,
};
