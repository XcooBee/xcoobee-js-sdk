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

**Setup**

- In `__tests__/integration/`, create a file named `.env.local`.
  + Add an `XCOOBEE__API_KEY` variable using an API key from a `developer` account
    on the test system.
  + Add an `XCOOBEE__API_SECRET` variable using an API secret from the same
    `developer` account.
  + Optionally, add a `XCOOBEE__API_URL_ROOT` variable set to a URI pointing to
    the root of the API URL you want to test.  Be sure to update the
    `XCOOBEE__API_KEY` and `XCOOBEE__API_SECRET` accordingly.

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
