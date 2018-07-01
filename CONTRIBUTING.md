# XcooBee JavaScript SDK


## Contributing


## Installation


## Testing


### Integration Testing

**Setup**

- In `__tests__/integration/`, create a file named `.env.local`.
  + Add an `XCOOBEE__API_KEY` variable using an API key from a `developer` account.
  + Add an `XCOOBEE__API_SECRET` variable using an API secret from the same
    `developer` account.
  + Optionally, add a `XCOOBEE__GRAPHQL_API_URL` variable set to a URI pointing to
    the GraphQL endpoint of the XcooBee API you want to test.

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
