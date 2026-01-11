import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import UserProfileComponent from '../UserProfileComponent.vue'

const loginWithRedirect = vi.fn()
const logout = vi.fn()
const user = ref<{ name?: string; picture?: string } | null>(null)
const isAuthenticated = ref(false)

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    loginWithRedirect,
    logout,
    user,
    isAuthenticated
  })
}))

describe('UserProfileComponent', () => {
  beforeEach(() => {
    loginWithRedirect.mockReset()
    logout.mockReset()
    user.value = null
    isAuthenticated.value = false
  })

  it('renders login button when unauthenticated', async () => {
    const wrapper = mount(UserProfileComponent)

    await wrapper.find('button').trigger('click')

    expect(loginWithRedirect).toHaveBeenCalled()
  })

  it('renders user initials when image missing', () => {
    user.value = { name: 'Jane Doe' }
    isAuthenticated.value = true

    const wrapper = mount(UserProfileComponent)

    expect(wrapper.find('.fallback-avatar').text()).toBe('JD')
  })

  it('calls logout with returnTo', async () => {
    user.value = { name: 'Jane Doe', picture: '' }
    isAuthenticated.value = true

    const wrapper = mount(UserProfileComponent)
    await wrapper.find('button').trigger('click')

    expect(logout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin }
    })
  })
})
