// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  name: 'project-overrides',
  rules: {
    '@stylistic/semi': ['error', 'always'],
    'semi': ['error', 'always'],
    'vue/multi-word-component-names': 'off'
  }
});
