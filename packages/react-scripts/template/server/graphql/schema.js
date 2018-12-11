import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

const Query = gql`
  type Query {
    hello: String
  }
`;
const Schema = gql`
  schema {
    query: Query
  }
`;
export const typeDefs = [Query, Schema];

export const resolvers = {
  Query: {
    hello: () => 'GraphQL',
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
