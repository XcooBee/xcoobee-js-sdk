import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import Path from 'path';

/**
 * A reference to the Base64 URL encoded regular expression.
 */
export const BASE64_URL_ENCODED__RE = /^[-\w]+$/;

// Example cursor: MBDYlKvqdrL826G8Dey9kLltEAPBphR/n1go6b9ER7KOZXTvkUBvkgvK8bWazyztrlis4w==
/**
 * A reference to the cursor regular expression that can be used to test if a
 * string appears to be a cursor.
 */
export const CURSOR__RE = /^[\w/=]+$/;

/**
 * Asserts that the specified value appears to be a cursor.
 *
 * @param {string} value - The value to check.
 */
export const assertIsCursorLike = (value) => {
  expect(value).toMatch(CURSOR__RE);
};

/**
 * Asserts that the presumed token is a a JWT.
 *
 * @param {string} presumedToken - The value presumed to be a JWT.
 */
export const assertIsJwtToken = (presumedToken) => {
  const presumedTokenParts = presumedToken.split('.');
  expect(presumedTokenParts.length).toBe(3);

  expect(presumedTokenParts[0]).toMatch(BASE64_URL_ENCODED__RE);
  expect(presumedTokenParts[1]).toMatch(BASE64_URL_ENCODED__RE);
  expect(presumedTokenParts[2]).toMatch(BASE64_URL_ENCODED__RE);

  const decoded = Jwt.decode(presumedToken, { complete: true });
  expect(decoded).not.toBeNull();
  expect(decoded).toBeDefined();
  expect(decoded.header).toBeDefined();
  expect(decoded.payload).toBeDefined();
};

/**
 * Loads the environment files from the specified path.
 *
 * The local environment variables in `.env.local` take precedence over the
 * project environment variables in `.env`.
 *
 * @param {string} path - The path to the environment files.
 */
export const loadEnv = (path) => {
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
  return new Promise((resolve, reject) => {
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
  loadEnv,
  sleep,
};

export default Utils;
