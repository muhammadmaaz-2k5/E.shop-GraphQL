import { GraphQLScalarType, GraphQLError, Kind, ValueNode } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType<Date, string>({
  name: 'DateTime',
  description: 'ISO 8601 datetime string',

  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new GraphQLError('DateTime must be a string');
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new GraphQLError('Invalid DateTime format');
    }
    return date;
  },

  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new GraphQLError('DateTime must be a Date object');
  },

  parseLiteral(ast: ValueNode): Date {
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

  parseValue(value: unknown): unknown {
    return value;
  },

  serialize(value: unknown): unknown {
    return value;
  },

  parseLiteral(ast: ValueNode): unknown {
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
  parseValue(value: unknown) {
    return value;
  },
  parseLiteral() {
    throw new GraphQLError('Upload values must be provided through variables');
  },
  serialize() {
    throw new GraphQLError('Upload values cannot be serialized');
  },
});
