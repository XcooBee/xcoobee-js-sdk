import dotenv from 'dotenv';
import Path from 'path';

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

/**
 * A reference to the Base64 URL encoded regular expression.
 */
export const BASE64_URL_ENCODED__RE = /^[-\w]+$/;

const Utils = {
  BASE64_URL_ENCODED__RE,
  loadEnv,
};

export default Utils;
