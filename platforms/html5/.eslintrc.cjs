module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-extra-semi": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "prefer-rest-params": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "@next/next/no-img-element": "off",
    "prefer-const": "error",
    "no-var": "error",
    "semi": "error",
    "no-console": "error",
    "space-before-function-paren": "error",
    "space-infix-ops": "error",
    "indent": [
      "error",
      2
    ],
    "quotes": [
      "error",
      "single",
      { "avoidEscape": true, "allowTemplateLiterals": false }
    ],
    "array-bracket-spacing": [
      "error",
      "always"
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "computed-property-spacing": [
      "error",
      "always"
    ]
  }
}
