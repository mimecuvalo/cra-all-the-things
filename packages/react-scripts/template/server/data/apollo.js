import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

export default function apolloServer(app) {
  const schema = new ApolloServer({ typeDefs, resolvers });
  schema.applyMiddleware({ app });
}
