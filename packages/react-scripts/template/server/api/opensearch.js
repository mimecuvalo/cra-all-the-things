import express from 'express';

export default function openSearchRouterFactory({ appName, urls }) {
  const router = express.Router();
  router.use((req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
        <ShortName>${appName}</ShortName>
        <Description>Search ${appName}</Description>
        <Url type="text/html" method="get" template="${urls.localUrlForBrowser}?q={searchTerms}"/>
        <Image height="16" width="16" type="image/x-icon">${urls.localUrlForBrowser}favicon.ico</Image>
      </OpenSearchDescription>`);
  });

  return router;
}
