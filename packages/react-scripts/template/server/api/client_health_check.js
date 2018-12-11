import express from 'express';

const router = express.Router();
router.post('/', (req, res) => {
  if (req.body.appVersion == 'somebadid' || req.body.appTime < 0 /* or before some time you specify as bad */) {
    res.send('bad');
    return;
  }

  // Otherwise, the client is good.
  res.send('ok');
});

export default router;
