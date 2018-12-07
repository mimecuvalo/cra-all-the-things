const { gql } = require('apollo-server-express');

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
const typeDefs = [Query, Schema];

const resolvers = {
  Query: {
    hello: () => 'GraphQL',
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
