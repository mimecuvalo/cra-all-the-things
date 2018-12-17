import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
  }

  extend type Query {
    allUsers: [User]
    fetchUser(id: Int!): User
  }

  extend type Mutation {
    login(email: String!): String
    createUser(username: String!, email: String!): User
  }
`;
