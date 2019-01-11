import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import createJwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import models from './models';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

/**
 * The main entry point for our Apollo/GraphQL server.
 * Works by apply middleware to the app.
 */
export default function apolloServer(app) {
  const schema = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        // For subscriptions
        return {
          models,
        };
      }
      const currentUser = await getCurrentUser(req);

      return {
        currentUser,
        models,
      };
    },
  });
  schema.applyMiddleware({ app });
}

// Used below by getCurrentUser to retrieve user information.
const jwksClient = createJwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getJwksKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// This checks the HTTP `Authorization` header of the form `Bearer {...token...}`.
// Make sure that the JWT that is supplied as the token is using RS256, not HS256.
// More details: https://auth0.com/docs/architecture-scenarios/server-api/api-implementation-nodejs
const getCurrentUser = async req => {
  if (req.headers['authorization']) {
    try {
      const token = req.headers['authorization'].split('Bearer ')[1];
      let decodedToken;
      await jwt.verify(
        token,
        getJwksKey,
        {
          algorithms: ['RS256'],
          issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
        },
        (err, decoded) => {
          if (err) {
            throw new AuthenticationError('Your session expired. Sign in again.');
          }
          decodedToken = decoded;
        }
      );
      return decodedToken;
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }

  return undefined;
};
