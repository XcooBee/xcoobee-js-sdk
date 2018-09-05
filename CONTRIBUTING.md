# XcooBee JavaScript SDK


## Contributing


## Installation

All that needs to be installed to start contributing to this project besides
`node` and `npm` is the project's dependencies.  These can be installed using
the following command.

```sh
npm install
```


## Building

Currently, the build script creates a bundle designed to run in the browser.  A
development and a production version can be built depending on the `mode`
option.

```sh
npm run build -- --mode=development
# Or
npm run build -- --mode=production
```


## Testing

There are both unit tests and integration tests.  Unit tests are avaiable to
test the code that doesn't have dependencies on a running API.

### Integration Testing

The test system running at https://testapi.xcoobee.net/Test has a `developer`
account with an XID of `~SDKTester_Developer` already setup.  The tests are
designed to work with this account.


**Setup**

In order for the tests to work with the preconfigured developer account, a few
environment variables need to be configured. The appropriate values are
pre-configured in `__tests__/integration/.env`. If you want to run the
integration tests against another system and/or different account, you may add
a `.env.local` file along side `.env` and override the default values.


**Running**

Because the use of some shared resources during the running of some integration
tests, the integration tests have been separated into two groups. One group, the
ones using shared resources, will run the tests sequentially, one after the
other. The other group will run the tests in parallel since the resources being
used don't have any known conflicts.

The safest thing to do is to run all integration tests sequentially but doing
that makes the tests take a lot longer.

**All Integration Tests**

```sh
npm run test:integration
# or
npm run test:integration -- --watch
```

**Parallel Tests Only**

```sh
npm run test:integration:parallel
# or
npm run test:integration:parallel -- --watch
```

**Sequential Tests Only**

```sh
npm run test:integration:sequential
# or
npm run test:integration:sequential -- --watch
```

### Unit Testing

**Running**

```sh
npm run test:unit
# or
npm run test:unit -- --watch
```
