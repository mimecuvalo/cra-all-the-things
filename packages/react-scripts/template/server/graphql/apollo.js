const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

function addGraphQLToApp(app) {
  const schema = new ApolloServer({ typeDefs, resolvers });
  schema.applyMiddleware({ app });
}

module.exports = addGraphQLToApp;
