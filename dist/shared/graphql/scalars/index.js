import { GraphQLScalarType, GraphQLError, Kind } from 'graphql';
export const DateTimeScalar = new GraphQLScalarType({
    name: 'DateTime',
    description: 'ISO 8601 datetime string',
    parseValue(value) {
        if (typeof value !== 'string') {
            throw new GraphQLError('DateTime must be a string');
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new GraphQLError('Invalid DateTime format');
        }
        return date;
    },
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        throw new GraphQLError('DateTime must be a Date object');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError('DateTime must be a string');
        }
        const date = new Date(ast.value);
        if (isNaN(date.getTime())) {
            throw new GraphQLError('Invalid DateTime format');
        }
        return date;
    },
});
export const JSONScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'Arbitrary JSON value',
    parseValue(value) {
        return value;
    },
    serialize(value) {
        return value;
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case Kind.STRING:
                return ast.value;
            case Kind.BOOLEAN:
                return ast.value;
            case Kind.INT:
            case Kind.FLOAT:
                return parseFloat(ast.value);
            case Kind.LIST:
                return ast.values;
            case Kind.OBJECT:
                return ast.fields;
            case Kind.NULL:
                return null;
            default:
                throw new GraphQLError('Invalid JSON value');
        }
    },
});
export const UploadScalar = new GraphQLScalarType({
    name: 'Upload',
    description: 'File upload',
    parseValue(value) {
        return value;
    },
    parseLiteral() {
        throw new GraphQLError('Upload values must be provided through variables');
    },
    serialize() {
        throw new GraphQLError('Upload values cannot be serialized');
    },
});
//# sourceMappingURL=index.js.map