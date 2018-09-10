import Path from 'path';

import dotenv from 'dotenv';
import jwtDecode from 'jwt-decode';

/**
 * A reference to the Base64 URL encoded regular expression.
 */
export const BASE64_URL_ENCODED__RE = /^[-\w]+$/;

// Example cursor: MBDYlKvqdrL826G8Dey9kLltEAPBphR/n1go6b9ER7KOZXTvkUBvkgvK8bWazyztrlis4w==
// Example cursor: CTZamTgKFUB5KJCpBduR9o6laIv/nZzsI+T01E1ldgQJeU/J18VvLkLbAb4KJDIL1uiaAA==
/**
 * A reference to the cursor regular expression that can be used to test if a
 * string appears to be a cursor.
 */
export const CURSOR__RE = /^[\w/=+]+$/;

// Example ISO 8601 Date: 2018-06-20T16:04:50Z
// Example ISO 8601 Date: 2018-08-19T21:27:43.392Z
const ISO8601__RE = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z/;

// Example ISO 8601 Date: 20180620T160450123Z
const ISO8601__COMPACT__RE = /\d{4}\d{2}\d{2}T\d{2}\d{2}\d{2}\d{3}Z/;

/**
 * Asserts that the specified value appears to be a cursor.
 *
 * @param {string} value - The value to check.
 * @param {boolean} [optional] - Flag indicating whether the value is optional.
 *   Defaults to `false`.
 */
export const assertIsCursorLike = (value, optional = false) => {
  if (!optional || value) {
    expect(value).toMatch(CURSOR__RE);
  }
};

/**
 * Asserts that the specified value is ISO 8601-like.
 *
 * @param {string} value - The value to check.
 * @param {boolean} [optional] - Flag indicating whether the value is optional.
 *   Defaults to `false`.
 */
export const assertIso8601Like = (value, optional = false) => {
  if (!optional || value) {
    expect(value).toMatch(ISO8601__RE);
  }
};

// TODO: Figure out why we have multiple ISO8601 date formats being returned from
// the GraphQL API.  Seems we should settle on just one.
export const assertCompactIso8601Like = value => {
  expect(value).toMatch(ISO8601__COMPACT__RE);
};

/**
 * Asserts that the presumed token is a a JWT.
 *
 * @param {string} presumedToken - The value presumed to be a JWT.
 */
export const assertIsJwtToken = presumedToken => {
  const presumedTokenParts = presumedToken.split('.');
  expect(presumedTokenParts.length).toBe(3);

  expect(presumedTokenParts[0]).toMatch(BASE64_URL_ENCODED__RE);
  expect(presumedTokenParts[1]).toMatch(BASE64_URL_ENCODED__RE);
  expect(presumedTokenParts[2]).toMatch(BASE64_URL_ENCODED__RE);

  const decodedPayload = jwtDecode(presumedToken);
  expect(decodedPayload).not.toBeNull();
  expect(decodedPayload).toBeDefined();
  expect(decodedPayload.exp).toBeDefined();
  expect(decodedPayload.iat).toBeDefined();
};

export function findBeesBySystemName(bees, bee_system_name) {
  return bees.filter(bee => bee.bee_system_name === bee_system_name);
}

/**
 * Loads the environment files from the specified path.
 *
 * The local environment variables in `.env.local` take precedence over the
 * project environment variables in `.env`.
 *
 * @param {string} path - The path to the environment files.
 */
export const loadEnv = path => {
  let result = dotenv.load({
    path: Path.resolve(path, '.env.local'),
  });
  if (result.error) {
    throw result.error;
  }

  result = dotenv.load({
    path: Path.resolve(path, '.env'),
  });
  if (result.error) {
    throw result.error;
  }
};

export const sleep = (ms, ...args) => {
  return new Promise((resolve, reject_unused) => {
    setTimeout(
      () => {
        resolve(...args)
      },
      ms
    );
  });
}

const Utils = {
  assertIsCursorLike,
  assertIsJwtToken,
  BASE64_URL_ENCODED__RE,
  findBeesBySystemName,
  loadEnv,
  sleep,
};

export default Utils;
