try {
  const { FlatCompat } = require('@eslint/eslintrc');

  const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
  });

  module.exports = [
    ...compat.extends('next/core-web-vitals'),
  ];
} catch (error) {
  // Fallback for production builds where @eslint/eslintrc might not be available
  console.warn('ESLint: Using fallback configuration due to missing @eslint/eslintrc');
  module.exports = [];
}
