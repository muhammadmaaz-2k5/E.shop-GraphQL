import { GraphQLError } from 'graphql';
export var ErrorCode;
(function (ErrorCode) {
    // Authentication errors
    ErrorCode["UNAUTHENTICATED"] = "UNAUTHENTICATED";
    ErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    ErrorCode["TOKEN_INVALID"] = "TOKEN_INVALID";
    // Authorization errors
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    // Validation errors
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCode["DUPLICATE_ENTRY"] = "DUPLICATE_ENTRY";
    // Business errors
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    ErrorCode["BUSINESS_RULE_VIOLATION"] = "BUSINESS_RULE_VIOLATION";
    ErrorCode["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    ErrorCode["CART_EMPTY"] = "CART_EMPTY";
    ErrorCode["INVALID_COUPON"] = "INVALID_COUPON";
    ErrorCode["ORDER_NOT_CANCELLABLE"] = "ORDER_NOT_CANCELLABLE";
    // Database errors
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCode["CONNECTION_ERROR"] = "CONNECTION_ERROR";
    // Rate limiting
    ErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
    ErrorCode["TOO_MANY_REQUESTS"] = "TOO_MANY_REQUESTS";
    // GraphQL specific
    ErrorCode["QUERY_TOO_COMPLEX"] = "QUERY_TOO_COMPLEX";
    ErrorCode["QUERY_TOO_DEEP"] = "QUERY_TOO_DEEP";
    // Internal
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(ErrorCode || (ErrorCode = {}));
export class AppError extends GraphQLError {
    code;
    details;
    httpCode;
    constructor(message, code, httpCode = 500, details) {
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
    constructor(message = 'Not authenticated', details) {
        super(message, ErrorCode.UNAUTHENTICATED, 401, details);
    }
}
export class InvalidCredentialsError extends AppError {
    constructor(message = 'Invalid credentials') {
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
    constructor(message = 'Access denied', details) {
        super(message, ErrorCode.FORBIDDEN, 403, details);
    }
}
export class ValidationError extends AppError {
    constructor(message, details) {
        super(message, ErrorCode.VALIDATION_ERROR, 400, details);
    }
}
export class NotFoundError extends AppError {
    constructor(resource, id) {
        const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
        super(message, ErrorCode.NOT_FOUND, 404, { resource, id });
    }
}
export class BusinessError extends AppError {
    constructor(message, code = ErrorCode.BUSINESS_RULE_VIOLATION, details) {
        super(message, code, 422, details);
    }
}
export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', details) {
        super(message, ErrorCode.DATABASE_ERROR, 500, details);
    }
}
export class RateLimitError extends AppError {
    constructor(retryAfter) {
        super('Too many requests', ErrorCode.RATE_LIMITED, 429, { retryAfter });
    }
}
export class QueryComplexityError extends AppError {
    constructor(actual, max) {
        super(`Query complexity ${actual} exceeds maximum ${max}`, ErrorCode.QUERY_TOO_COMPLEX, 400, { actual, max });
    }
}
export class QueryDepthError extends AppError {
    constructor(actual, max) {
        super(`Query depth ${actual} exceeds maximum ${max}`, ErrorCode.QUERY_TOO_DEEP, 400, { actual, max });
    }
}
export function formatGraphQLError(error) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (error instanceof AppError) {
        return error;
    }
    if (isProduction && !(error instanceof AppError)) {
        const safeMessage = 'An internal error occurred';
        return new AppError(safeMessage, ErrorCode.INTERNAL_ERROR, 500, isProduction ? undefined : { originalMessage: error.message, stack: error.stack });
    }
    return new AppError(error.message, ErrorCode.INTERNAL_ERROR, 500, { originalError: error });
}
//# sourceMappingURL=index.js.map