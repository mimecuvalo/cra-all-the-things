import errorRouter from './error';
import express from 'express';
import openSearchRouterFactory from './opensearch';

export default function apiServerFactory({ appName, urls }) {
  const router = express.Router();
  router.use('/opensearch', openSearchRouterFactory({ appName, urls }));
  router.use('/report-error', errorRouter);
  router.get('/', (req, res) => {
    res.sendStatus(404);
  });

  return router;
}
