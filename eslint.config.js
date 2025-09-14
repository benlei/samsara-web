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
  // Fallback configuration if @eslint/eslintrc is not available
  module.exports = {
    extends: ['next/core-web-vitals'],
  };
}
