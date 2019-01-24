// ESLint configuration for this directory and below.  Before changing
// configuration here, consider whether the change would be most appropriate:
// here, below, or above in the hierarchy.
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  env: {
    jest: true,
  },

  rules: {
    'max-len': 'off',
    'no-new': 'off',

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
  },
};
