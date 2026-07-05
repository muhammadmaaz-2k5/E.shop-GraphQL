import { GraphQLError } from 'graphql';
export declare enum ErrorCode {
    UNAUTHENTICATED = "UNAUTHENTICATED",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    TOKEN_INVALID = "TOKEN_INVALID",
    FORBIDDEN = "FORBIDDEN",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
    NOT_FOUND = "NOT_FOUND",
    ALREADY_EXISTS = "ALREADY_EXISTS",
    BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    CART_EMPTY = "CART_EMPTY",
    INVALID_COUPON = "INVALID_COUPON",
    ORDER_NOT_CANCELLABLE = "ORDER_NOT_CANCELLABLE",
    DATABASE_ERROR = "DATABASE_ERROR",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    RATE_LIMITED = "RATE_LIMITED",
    TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
    QUERY_TOO_COMPLEX = "QUERY_TOO_COMPLEX",
    QUERY_TOO_DEEP = "QUERY_TOO_DEEP",
    INTERNAL_ERROR = "INTERNAL_ERROR"
}
export declare class AppError extends GraphQLError {
    readonly code: ErrorCode;
    readonly details?: Record<string, unknown>;
    readonly httpCode: number;
    constructor(message: string, code: ErrorCode, httpCode?: number, details?: Record<string, unknown>);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class InvalidCredentialsError extends AppError {
    constructor(message?: string);
}
export declare class TokenExpiredError extends AppError {
    constructor();
}
export declare class TokenInvalidError extends AppError {
    constructor();
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string, id?: string);
}
export declare class BusinessError extends AppError {
    constructor(message: string, code?: ErrorCode, details?: Record<string, unknown>);
}
export declare class DatabaseError extends AppError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class RateLimitError extends AppError {
    constructor(retryAfter?: number);
}
export declare class QueryComplexityError extends AppError {
    constructor(actual: number, max: number);
}
export declare class QueryDepthError extends AppError {
    constructor(actual: number, max: number);
}
export declare function formatGraphQLError(error: GraphQLError): GraphQLError;
//# sourceMappingURL=index.d.ts.map