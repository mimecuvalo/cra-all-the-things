import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import userResolvers from './user';

const exampleResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),

  Query: {
    // Just spits out what it's given as a test example.
    async echoExample(parent, { str }, { currentUser, models }) {
      return { exampleField: str };
    },

    hello: () => 'GraphQL',
  },
};

export default [exampleResolvers, userResolvers];
