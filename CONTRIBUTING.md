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
development and a production version can be build depending on the `mode`
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

```sh
npm run test:integration
# or
npm run test:integration -- --watch
```

### Unit Testing

**Running**

```sh
npm run test:unit
# or
npm run test:unit -- --watch
```
