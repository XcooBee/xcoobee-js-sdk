// ESLint configuration for this directory and below.  Before changing
// configuration here, consider whether the change would be most appropriate:
// here, below, or above in the hierarchy.
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  rules: {

    'require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
      },
    }],

    'valid-jsdoc': [
      'error',
      {
        prefer: {
          arg: 'param',
          argument: 'param',
          class: 'constructor',
          return: 'returns',
          virtual: 'abstract',
        },
        preferType: {
          'Boolean': 'boolean',
          'Number': 'number',
          'String': 'string',
        },
        requireParamDescription: false,
        requireParamType: true,
        requireReturn: false,
        requireReturnDescription: false,
        requireReturnType: true,
      },
    ],
  },
};
