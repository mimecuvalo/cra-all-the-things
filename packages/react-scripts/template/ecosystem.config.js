module.exports = {
  _comment: 'This is used by pm2 on production.',
  apps: [
    {
      name: 'all-the-things',
      script: 'npm run serve:prod',
    },
  ],
};
