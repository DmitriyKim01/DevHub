// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
)
  .override('nuxt/eslint', {
    rules: {
      'vue/multi-word-component-names': 'off',
      'semi': ['error', 'always'],
    }
  })
