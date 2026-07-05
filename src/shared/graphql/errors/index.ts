import { GraphQLError } from 'graphql';

export enum ErrorCode {
  // Authentication errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // Authorization errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

  // Business errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  CART_EMPTY = 'CART_EMPTY',
  INVALID_COUPON = 'INVALID_COUPON',
  ORDER_NOT_CANCELLABLE = 'ORDER_NOT_CANCELLABLE',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',

  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // GraphQL specific
  QUERY_TOO_COMPLEX = 'QUERY_TOO_COMPLEX',
  QUERY_TOO_DEEP = 'QUERY_TOO_DEEP',

  // Internal
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends GraphQLError {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;
  public readonly httpCode: number;

  constructor(
    message: string,
    code: ErrorCode,
    httpCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message, {
      extensions: {
        code,
        http: { status: httpCode },
        ...details,
      },
    });
    this.code = code;
    this.httpCode = httpCode;
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Not authenticated', details?: Record<string, unknown>) {
    super(message, ErrorCode.UNAUTHENTICATED, 401, details);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid credentials') {
    super(message, ErrorCode.INVALID_CREDENTIALS, 401);
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super('Token has expired', ErrorCode.TOKEN_EXPIRED, 401);
  }
}

export class TokenInvalidError extends AppError {
  constructor() {
    super('Invalid token', ErrorCode.TOKEN_INVALID, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', details?: Record<string, unknown>) {
    super(message, ErrorCode.FORBIDDEN, 403, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    super(message, ErrorCode.NOT_FOUND, 404, { resource, id });
  }
}

export class BusinessError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.BUSINESS_RULE_VIOLATION, details?: Record<string, unknown>) {
    super(message, code, 422, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: Record<string, unknown>) {
    super(message, ErrorCode.DATABASE_ERROR, 500, details);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Too many requests', ErrorCode.RATE_LIMITED, 429, { retryAfter });
  }
}

export class QueryComplexityError extends AppError {
  constructor(actual: number, max: number) {
    super(`Query complexity ${actual} exceeds maximum ${max}`, ErrorCode.QUERY_TOO_COMPLEX, 400, { actual, max });
  }
}

export class QueryDepthError extends AppError {
  constructor(actual: number, max: number) {
    super(`Query depth ${actual} exceeds maximum ${max}`, ErrorCode.QUERY_TOO_DEEP, 400, { actual, max });
  }
}

export function formatGraphQLError(error: GraphQLError): GraphQLError {
  const isProduction = process.env.NODE_ENV === 'production';

  if (error instanceof AppError) {
    return error;
  }

  if (isProduction && !(error instanceof AppError)) {
    const safeMessage = 'An internal error occurred';
    return new AppError(
      safeMessage,
      ErrorCode.INTERNAL_ERROR,
      500,
      isProduction ? undefined : { originalMessage: error.message, stack: error.stack }
    );
  }

  return new AppError(
    error.message,
    ErrorCode.INTERNAL_ERROR,
    500,
    { originalError: error }
  );
}
