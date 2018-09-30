# XcooBee JavaScript SDK

The XcooBee SDK is a facility to abstract lower level calls and implement
standard behaviors.  The XcooBee team is providing this to improve the speed of
implementation and show the best practices while interacting with XcooBee.

Generally, all communication with XcooBee is encrypted over the wire since none
of the XcooBee systems will accept plain traffic.  All data sent to XcooBee from
you and vice versa can be signed using PGP protocols with the proper
configuration.  The data packets that you will receive are signed with your
public key and the packages that you send are signed with your private key.
TODO: I don't believe any communication is encrypted with the private key.

If you need to generate new PGP keys you can login to your XcooBee account and
go to the `Settings` page to do so.

TODO: Review this paragraph. I don't believe the developer needs to implement
`getEvents`. Don't they just need to use the function to get the events?
Some methods require a Consent Campaign setup which you can do in your Consent
Administration in UI.  You setup such things as endpoints and what data is
collected.  If you have a developer account, a `test` campaign is created
automatically when you signup and no endpoint.  You will need to implement
`getEvents()` to pull events.  You will have no UI access to it.

XcooBee systems operate globally but with regional connections.  The SDK will be
connecting you to your regional endpoint automatically.

There is detailed and extensive API documentation available on our
[documentation site](https://www.xcoobee.com/docs).


## call limits

If you are using developer accounts, please be aware that there is a call limit.
This is normally 120 calls per hour or 600 calls per 24 hour period.

For subscription accounts your call limits are determined per your account and
contract.  If you hit your call limits, you will need to contact your account
manager or support to increase them.

Once you have exceeded your call limits, your call will return status `429` too
many requests.


## logs

API calls are logged like standard transactions with the same time to live
constraints.


## About PGP Secret and password

All PGP data is optional to the configuration object.  If you do not supply it,
then the SDK will skip decryption/encryption steps.  You will have to do these
outside the SDK and supply or process the data yourself.
TODO: We are not doing anything with the PGP configuration information.
TODO: How would one do the decryption/encryption steps outside of the SDK?


## Asynchronous

Because JavaScript is not multi-threaded, almost all function calls in the SDK
are asynchronous (i.e., non-blocking).  Each asynchronous function returns a
`Promise`.  This allows the use of `async/await` syntax in JS environments that
support it.  Being asynchronous allows the SDK to be embedded, for example in an
Express app, and not block the app for each call to the SDK.  The `Promise` may
be resolved with a `Response` instance or rejected with an `ErrorResponse`
instance.


## Getting Started

Before using the SDK, it needs to be configured.  Once created, the
configuration can be set on the SDK instance. In this case, each function call
will fallback to using this configuration.  Alternatively, you may pass a
reference to a configuration instance to each function call.  This passed
configuration will take presidence over any configuration set on the SDK
instance.

### The config object

The config object carries all basic configuration information for your specific
setup and use. There are two ways to instantiate a config object. The first way
is to use the constructor directly. The second way is to use the constructor
indirectly via an utility function.

**Constructor**

```js
import XcooBee from '@xcoobee/sdk-js';

const config = new XcooBee.sdk.Config({
  apiKey: 'YourApiKey',
  apiSecret: 'YourApiSecret',
  apiUrlRoot: 'https://api.xcoobee.net',
  campaignId: 'TheIdOfOneOfYourCampaigns',
});
```

**Utility Function**

```js
import XcooBee from '@xcoobee/sdk-js';

XcooBee.sdk.ConfigUtils.createFromFile()
  .then(config => {
    ...
  })
  .catch(err => console.error(err));
```

The `createFromFile` function will search for a XcooBee config file in the
user's home directory. See the API docs for details.

Regardless of which way you choose to instantiate a config instance, it needs to
be made available to the SDK functions. One way is to let the SDK transparently
handle it by passing the SDK instance a reference. The other way is to pass a
reference to each SDK function call.

**Passing a Reference to SDK Instance**

The config instance can be set on an SDK instance by passing it to the
`XcooBee.sdk.Sdk` constructor or it can be set post construction with the
`Sdk#config` setter.

```js
// Set config during Sdk construction.
const sdk = XcooBee.sdk.Sdk(config);
```

```js
// Set after Sdk construction.
sdk.config = config;
```

Then a call to an SDK function will not need to be passed a reference to a
config instance. For example, calling `bees.listBees` can be as simple as

```js
sdk.bees.listBees('social').then(...);
```

**Passing a Reference with Each Function Call**

All SDK functions accept an optional reference to a config instance as the last
argument. When passed as the last argument, then any config instance passed to
the SDK instance will be ignored.

The following demonstrates passing a config instance to `bees.listBees`.

```js
sdk.bees.listBees('social', null, null, config).then(...);
```

Note: The config passed to an SDK function is not merged with the config passed
to the SDK instance.


## Responses

All calls to the SDK functions return a `Promise` which will either resolve with
a successful response or reject with an error response. An error response means
that the call did not complete successfully and no processing operation has
begun. A successful response, on the other hand, means that the _call_ completed
successfully but it does not necessarily mean that the processing operation
initiated by the call has also completed. It all depends on the particular SDK
function being called. For example, when the `bees.listBees` function resolves
with a successful response, the processing operation (in this case, searching
for a list of bees matching a search string) has completed and the result is
apart of the response. However, when the `consents.requestConsent` function
resolves with a successful response, the processing operation has just begun.
The actual response to the requesting consent is asynchronous. The actual
response will be `POST`ed to the webhook after the processing operation has
completed. Which of the SDK functions result in a webhook being called is
documented in the API docs.
