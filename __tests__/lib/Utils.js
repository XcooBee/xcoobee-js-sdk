import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import Path from 'path';

/**
 * A reference to the Base64 URL encoded regular expression.
 */
export const BASE64_URL_ENCODED__RE = /^[-\w]+$/;

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
  assertIsJwtToken,
  BASE64_URL_ENCODED__RE,
  loadEnv,
  sleep,
};

export default Utils;
