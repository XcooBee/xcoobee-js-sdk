const express = require('express');
const XcooBee = require('xcoobee-sdk');

const app = express();
const port = 3000;

const config = new XcooBee.Config({
  apiKey: 'yourApiKey',
  apiSecret: 'yourApiSecret',
  apiUrlRoot: 'https://api.xcoobee.net',
  campaignId: 'defaultCampaignId',
  pgpPassword: 'yourPgpPass',
  pgpSecret: 'yourPgpSecret',
});
const sdk = new XcooBee.Sdk(config);

app.post('/', (req, res) => {

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    const testHandler = (payload) => {
      console.log(payload);

      res.send(payload.consentId);
    };

    sdk.system.handleEvents({ testHandler }, [], body, req.headers);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
