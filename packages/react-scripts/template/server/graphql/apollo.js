import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';

export default function apolloServer(app) {
  const schema = new ApolloServer({ typeDefs, resolvers });
  schema.applyMiddleware({ app });
}
