// ESLint configuration for this directory and below.  Before changing
// configuration here, consider whether the change would be most appropriate:
// here, below, or above in the hierarchy.
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: 'babel-eslint',

  extends: [],

  plugins: ['import'],

  rules: {
    // Many times we use snake case for data properties.  Therefore, we don't want to
    // enforce camelcase.
    camelcase: 'off',

    'no-unused-vars': ['error', { argsIgnorePattern: '_unused$' }],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/default.md
    'import/default': 'error',

    // Set `allowComputed` option to `true` when necessary.
    // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/namespace.md
    'import/namespace': 'error',

    // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/no-deprecated.md
    'import/no-deprecated': 'error',

    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': [
      'error',
      {
        // Set the paths where it is okay to have devDependencies:
        devDependencies: ['__tests__/**/*.js'],
      },
    ],

    // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/no-namespace.md
    'import/no-namespace': 'error',

    // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/no-useless-path-segments.md
    'import/no-useless-path-segments': 'off',

    // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/order.md
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always-and-inside-groups',
      },
    ],
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
