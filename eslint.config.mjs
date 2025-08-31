// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  name: 'project-overrides',
  rules: {
    // Semicolons
    '@stylistic/semi': ['error', 'always'],
    'semi': ['error', 'always'],

    // Disable new-line enforcement
    '@stylistic/eol-last': 'off',

    // Vue-specific
    'vue/multi-word-component-names': 'off'
  }
});
