import pluginVue from 'eslint-plugin-vue'
import tseslint from '@vue/eslint-config-typescript'

export default [
  ...pluginVue.configs['flat/recommended'],
  ...tseslint(),
  {
    rules: {
      'vue/require-explicit-emits': 'warn',
      'vue/require-default-prop': 'warn'
    }
  }
]