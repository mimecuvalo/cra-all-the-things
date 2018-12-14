import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const Query = gql`
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Query {
    allUsers: [User]
    fetchUser(id: Int!): User

    hello: String
  }

  type Mutation {
    login(email: String!): String
    createUser(name: String!, email: String!): User
  }
`;
const Schema = gql`
  schema {
    query: Query
  }
`;
export const typeDefs = [Query, Schema];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
