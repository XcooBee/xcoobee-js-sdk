# JavaScript XcooBee SDK Usage Examples


## Installation

The JavaScript (JS) XcooBee SDK is available as a package from NPM. Use the
following to install for your project.

```sh
npm install @xcoobee/sdk-js
```

The `yarn` equivalent works too.

```sh
yarn add @xcoobee/sdk-js
```


## Initialization

```js
import XcooBee from '@xcoobee/sdk-js';

const config = new XcooBee.sdk.Config({
  apiKey: 'YourApiKey',
  apiSecret: 'YourApiSecret',
  apiUrlRoot: 'https://api.xcoobee.net',
  campaignId: 'TheIdOfOneOfYourCampaigns',
});

const sdk = new XcooBee.sdk.Sdk(config);
```


## Usage

Once an SDK instance is created and configured, it can be used. Almost every
function of the SDK is asynchronous and returns a `Promise`.

We can test whether our SDK instance is properly configured by calling
`system.ping`.

```js
sdk.system.ping()
  .then(successResponse => {
    const { result } = successResponse;
    console.log('The SDK is configured correctly.');
    console.log('`ping` resulted in %o', result);
  })
  .catch(errorResponse => {
    const { code, error } = errorResponse;
    const msg = 'The SDK is not configured correctly or the XcooBee system ' +
      'is temporarily unavailable.';
    console.error(msg, code, error);
  });
```

If the JavaScript environment where you will be executing the SDK calls supports
the `async/await` syntax, then you can use the following syntax instead.

```js
async function checkSdkConfiguration() {
  try {
    const successResponse = await sdk.system.ping();
    const { result } = successResponse;
    console.log('The SDK is configured correctly.');
    console.log('`ping` resulted in %o', result);
  }
  catch (errorResponse) {
    const { code, error } = errorResponse;
    const msg = 'The SDK is not configured correctly or the XcooBee system ' +
      'is temporarily unavailable.';
    console.error(msg, code, error);
  }
}
checkSdkConfiguration();
```

But for demonstration purposes, we'll use the `then/catch` call chain on the
returned `Promise`.

After confirming that the SDK instance is properly configured, you may want to
get the information about the default campaign as declared by the `campaignId`
property of the configuration.

```js
sdk.consents.getCampaignInfo()
  .then(successResponse => {
    const { result } = successResponse;
    const { campaign } = result;
    console.log('campaign: %o', campaign);
  })
  .catch(errorResponse => {
    const { code, error } = errorResponse;
    const msg = 'Was not able to get the campaign information.';
    console.error(msg, code, error);
  });
```

Some function calls return a list of data. However, the entire list may not be
returned in a single call. That is, the list of data is paged. These functions
are documented as returning a `Promise` that resolves with a `PagingResponse`
and rejects with an `ErrorResponse`. These functions also accept `after` and
`limit` arguments.

One such function is `bees.listBees` which returns pages of bees your account
has access to. Some accounts may only have a single page.

Here is how you can get the complete list of bees for your account.

```js
let bees = [];

function collectBees(pagingResponse) {
  const { result } = pagingResponse;
  const pageOfBees = result.data;
  bees = bees.concat(pageOfBees);
  if (pagingResponse.hasNextPage()) {
    pagingResponse.getNextPage().then(collectBees);
  } else {
    // TODO: Do something with the bees.
    console.dir(bees);
  }
}

sdk.bees.listBees()
  .then(collectBees)
  .catch(errorResponse => {
    const { code, error } = errorResponse;
    console.error(code, error);
  });
```

The SDK provides `hasNextPage` and `getNextPage` methods on all responses from
the SDK calls. However, they only have real meaning on the function calls
returning a list of data.
