import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginComponent from '../LoginComponent.vue'
import { ref } from 'vue'

const loginWithRedirect = vi.fn()

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    loginWithRedirect,
    user: ref(null),
    isAuthenticated: ref(false),
    isLoading: ref(false)
  })
}))

describe('LoginComponent', () => {
  it('calls login on click', async () => {
    const wrapper = mount(LoginComponent)

    await wrapper.find('button').trigger('click')

    expect(loginWithRedirect).toHaveBeenCalled()
  })
})
