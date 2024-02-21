module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
  },
};
