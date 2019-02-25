module.exports = {
  extends: ['airbnb-base'],
  plugins: [],
  rules: {
    "linebreak-style": "off",
    "padded-blocks": "off",
    "prefer-destructuring": "off",
    "camelcase": "off",
    "max-len": "off",
    "no-underscore-dangle": "off",
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never",
    }],
    "arrow-body-style": ["off", "as-needed", { "requireReturnForObjectLiteral": true }],
  },
};
