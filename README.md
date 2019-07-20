# XcooBee JavaScript SDK

The XcooBee SDK is a facility to abstract lower level calls and implement standard behaviors.
The XcooBee team is providing this to improve the speed of implementation and show the best practices while interacting with XcooBee.

Generally, all communication with XcooBee is encrypted over the wire since none of the XcooBee systems will accept plain traffic. All data sent to XcooBee from you and vice versa is going to use encryption. In addition, non-bee event communication to you is also signed using your PGP key.

If you need to generate new PGP keys you can login to your XcooBee account and go to the `Settings` page to do so.

XcooBee systems operate globally but with regional connections. The SDK will be connecting you to your regional endpoint automatically.

There is detailed and extensive [API documentation](https://github.com/XcooBee/xcoobee-js-sdk/blob/1.2.0/API.md).

# Instalation

## For Node JS projects:

`npm install xcoobee-sdk --save`

## For browser projects:

### Use our CDN:

Use from our CDN distribution point:
You can use this pattern.

https://app.xcoobee.net/scripts/sdk/[version]

Available versions:

   - xcoobee-sdk-1.0.0.web.js

A fully formed url for you script tag would be

`<script src='https://app.xcoobee.net/scripts/sdk/xcoobee-sdk-1.0.0.web.js' />`

### Build yourself:

1. Clone repo from GitHub.

`git clone https://github.com/XcooBee/xcoobee-js-sdk.git`

2. then run the following node commands

```
npm install
npm run build
```

3. You should have a minified js file like `xcoobee-sdk-1.0.0.web.js` in the `/dist` directory. You can use it in your web project via script tags.

```
<script src='xcoobee-sdk-1.0.0.web.js' />
```

Don't forget that if you need to use the openpgp to decrypt payloads you need to load the OpenPGP library files as well. Either via the openpgp CDN or from your own site. You can use cdnjs via `https://cdnjs.com/libraries/openpgp`.

Example of load with openpgp library all from your own source:

```
<script src='openpgp.min.js' />
<script src='openpgp.worker.js' />
<script src='xcoobee-sdk-0.9.5.web.js' />
```

# Usage

Before using the SDK, it needs to be configured.
Once created, the configuration can be set on the SDK instance. In this case, each function call will fallback to using this configuration.
Alternatively, you may pass a reference to a configuration instance to each function call. This passed configuration will take precedence over any configuration set on the SDK instance.

**CommonJS:**
```js
const XcooBee = require("xcoobee-sdk");
```
**or ES6:**
```js
import XcooBee from "xcoobee-sdk";
```

## The config object

The config object carries all basic configuration information for your specific setup and use. There are two ways to instantiate a config object. The first way is to use the constructor directly. The second way is to use the constructor indirectly via an utility function.

### Options

```js
const options = {
  apiKey: 'YourApiKey',
  apiSecret: 'YourApiSecret',
  campaignId: 'TheIdOfOneOfYourCampaigns',
  pgpSecret: 'YourPGPSecret',
  pgpPassword: 'YourPGPPassphrase',
};
```
where
```
apiKey      => the api-key
apiSecret   => the api-secret
campaignId  => the default campaign id
pgpSecret   => the pgp private key
pgpPassword => the password for your pgp key
```

### Config instance

#### Browser

```js
const config = new XcooBee.sdk.Config(options);
```

#### NodeJS

**1. Via constructor**

```js
const config = new XcooBee.Config(options);
```

**2. Via utility from file**

```js
const config = await XcooBee.ConfigUtils.createFromFile();
```

The `createFromFile` function will search for a XcooBee config file in the user's home directory.

The files will be located inside your `home` directory in the `.xcoobee` subdirectory. Thus the full path to config are:

`/[home]/.xcoobee/config` => the configuration options

`/[home]/.xcoobee/pgp.secret` => the pgp secret key in separate file


on Windows it is in the root of your user directory

`/Users/MyUserDir/.xcoobee/config` => the configuration option

`/Users/MyUserDir/.xcoobee/pgp.secret` => the pgp secret key in separate file

The initial content of the config file is plain text, with each option on a separate line.

**example file**:
```
apiKey=8sihfsd89f7
apiSecret=8937438hf
campaignId=ifddb4cd9-d6ea-4005-9c7a-aeb104bc30be
pgpPassword=somethingsecret
```

## SDK instance

**Passing a Reference to SDK Instance**

The config instance can be set on an SDK instance by passing it to the
`Sdk` constructor or it can be set post construction with the
`Sdk#config` setter.

### Browser

```js
const sdk = new XcooBee.sdk.Sdk(config);
```

### NodeJS

```js
const sdk = new XcooBee.Sdk(config);
```

**Set after Sdk construction.**
```js
sdk.config = config;
```

Then a call to an SDK function will not need to be passed a reference to a
config instance. For example, calling `bees.listBees` can be as simple as

```js
const bees = await sdk.bees.listBees('social');
```

**Passing a Reference with Each Function Call**

All SDK functions accept an optional reference to a config instance as the last
argument. When passed as the last argument, then any config instance passed to
the SDK instance will be ignored.

The following demonstrates passing a config instance to `bees.listBees`.

```js
const bees = await sdk.bees.listBees('social', config);
```

Note: The config passed to an SDK function is not merged with the config passed
to the SDK instance.

# Tests

## Running Unit Tests

You can use the following command line to run unit test to validate the project

`npm run test:unit`

## Running Integration Tests

When your initial developer account is created it will be populated with data so that you can test the project against actual data and system.
You will have to configure your `__tests__\integration\.env.local` file prior to running the integration tests.

You can use a command line to run the integration tests for this project. You will need to **clone the repo** from GitHub and run the following command line:

`npm run test:integration`
