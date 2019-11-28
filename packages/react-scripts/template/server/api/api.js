import adminRouter from './admin';
import authorization from '../authorization';
import authRouter from './auth';
import clientHealthCheckRouter from './client_health_check';
import errorRouter from './error';
import express from 'express';
import openSearchRouterFactory from './opensearch';

/**
 * Main routing entry point for all of our API server.
 */
export default function apiServerFactory({ appName }) {
  const router = express.Router();
  router.use('/admin', isAdmin, adminRouter);
  router.use('/auth', authRouter);
  router.use('/client-health-check', clientHealthCheckRouter);
  router.use('/is-user-logged-in', isAuthenticated, (req, res) => {
    // Just an example of the isAuthenticated (very simplistic) capability.
    res.send('OK');
  });
  router.use('/opensearch', openSearchRouterFactory({ appName }));
  router.use('/report-error', errorRouter);
  router.get('/', (req, res) => {
    res.sendStatus(404);
  });

  return router;
}

const isAuthenticated = (req, res, next) =>
  authorization.isAuthenticated(req.session.user) ? next() : res.sendStatus(401);

const isAdmin = (req, res, next) =>
  authorization.isAdmin(req.session.user) ? next() : res.status(403).send('I call shenanigans.');
