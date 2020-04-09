module.exports = {
  /**
   * base
   */
  'no-console': 0,
  'comma-dangle': 0,
  'default-case': 0,
  'padded-blocks': ['error', {
    classes: 'always'
  }],
  'lines-between-class-members': ['error', 'always', {
    exceptAfterSingleLine: true
  }],
  'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0 }],
  'object-curly-newline': ['error', { 'minProperties': 4, 'consistent': true }],
  'implicit-arrow-linebreak': ['error', 'beside'],
  "import/no-named-as-default": 0,
  'import/no-unresolved': 0,
  'import/no-named-as-default-member': 0,
  'import/prefer-default-export': 0,
  'no-use-before-define': ['error', { 'functions': false, 'classes': true, 'variables': false }],
  'function-paren-newline': ['error', 'consistent'], // didn't understand this rule
  'arrow-parens': ['error', 'as-needed', {
    'requireForBlockBody': true
  }],
  'prefer-object-spread': 'off',
  'no-param-reassign': ['error', { 'props': true, 'ignorePropertyModificationsFor': ['target'] }],
  'func-names': ['error', 'as-needed'],
  
  /**
   * typescript
   */
  '@typescript-eslint/explicit-function-return-type': "off",
  // Rewrite eslint rule to typescript-rule
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": ["warn", {
    "vars": "all",
    "args": "after-used",
    "ignoreRestSiblings": true
  }],
};
