import { GraphQLSchema } from 'graphql';

export function authDirective() {
  return {
    authDirectiveTransformer: (schema: GraphQLSchema): GraphQLSchema => schema,
  };
}
