import clientHealthCheckRouter from './client_health_check';
import errorRouter from './error';
import express from 'express';
import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';
import openSearchRouterFactory from './opensearch';

/**
 * Main routing entry point for all of our API server.
 */
export default function apiServerFactory({ appName, urls }) {
  const router = express.Router();
  router.use('/client-health-check', clientHealthCheckRouter);
  router.use('/is-user-logged-in', checkHasValidLogin, (req, res) => {
    // Just an example of the checkHasValidLogin capability.
    res.send('OK');
  });
  router.use('/opensearch', openSearchRouterFactory({ appName, urls }));
  router.use('/report-error', errorRouter);
  router.get('/', (req, res) => {
    res.sendStatus(404);
  });

  return router;
}

// Add as middleware to any of your routes, e.g.:
//   router.use('/path-where-login-is-needed', checkHasValidLogin, loggedInRouter);
// This checks the HTTP `Authorization` header of the form `Bearer {...token...}`.
// Make sure that the JWT that is supplied as the token is using RS256, not HS256.
// More details: https://auth0.com/docs/architecture-scenarios/server-api/api-implementation-nodejs
// If there is a current user (via the token in the Authorization header), then it is set via `jwt` in `req.user`.
const checkHasValidLogin = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});
