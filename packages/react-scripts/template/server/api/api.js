import _ from 'lodash';
import authorization from '../authorization';
import authRouter from './auth';
import clientHealthCheckRouter from './client_health_check';
import errorRouter from './error';
import express from 'express';
import fs from 'fs';
import openSearchRouterFactory from './opensearch';
import path from 'path';

/**
 * Main routing entry point for all of our API server.
 */
export default function apiServerFactory({ appName }) {
  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/client-health-check', clientHealthCheckRouter);
  router.use('/is-user-logged-in', isAuthenticated, (req, res) => {
    // Just an example of the isAuthenticated (very simplistic) capability.
    res.send('OK');
  });
  router.use('/opensearch', openSearchRouterFactory({ appName }));
  router.post('/admin/repl', isAdmin, async (req, res) => {
    // Also, this is disabled by default because it's so powerful (a powerful footgun, that is).
    // Enabling this means you need to make damn sure the API you're calling is internally accessible only.
    return res.json({ result: 'DISABLED_FOR_SECURITY_DONT_ENABLE_UNLESS_YOU_KNOW_WHAT_YOURE_DOING', success: false });

    // const source = req.body.source;
    // let success = true;
    // let result = null;
    // try {
    //   result = eval(source);
    // } catch (ex) {
    //   success = false;
    //   console.log(ex);
    // }
    // res.json({ result, success });
  });
  router.get('/admin/clientside-exceptions', async (req, res) => {
    let exceptions = '';
    try {
      exceptions = fs.readFileSync(
        path.resolve(process.cwd(), 'logs', `clientside-exceptions-${new Date().toISOString().slice(0, 10)}.log`),
        'utf8'
      );
    } catch (ex) {
      // silently fail.
      console.log(ex);
    }

    const individualExceptions = exceptions
      .split('\n')
      .map(e => e && JSON.parse(e))
      .filter(e => e);
    const groupedExceptions = _.groupBy(individualExceptions, 'message');

    res.json({ exceptions: groupedExceptions });
  });
  router.use('/report-error', errorRouter);
  router.get('/', (req, res) => {
    res.sendStatus(404);
  });

  return router;
}

const isAdmin = (req, res, next) => (authorization.isAdmin(req.session.user) ? next() : res.sendStatus(401));

const isAuthenticated = (req, res, next) =>
  authorization.isAuthenticated(req.session.user) ? next() : res.sendStatus(401);

// const isAdmin = (req, res, next) =>
//   authorization.isAdmin(req.session.user) ? next() : res.status(403).send('I call shenanigans.');
