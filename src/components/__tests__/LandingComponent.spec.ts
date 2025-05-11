import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LandingComponent from '../LandingComponent.vue'

const loginWithRedirectMock = vi.fn()

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    loginWithRedirect: loginWithRedirectMock
  })
}))

describe('LandingComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(LandingComponent)
    expect(wrapper.text()).toContain('Pathfinder Honor Manager')
    expect(wrapper.text()).toContain('Track Progress')
    expect(wrapper.text()).toContain('Bulk Management')
    expect(wrapper.text()).toContain('Digital Records')
  })

  it('calls login when login button is clicked', async () => {
    const wrapper = mount(LandingComponent)
    const loginButton = wrapper.find('.login-button')
    await loginButton.trigger('click')
    expect(loginWithRedirectMock).toHaveBeenCalledWith({
      appState: { targetUrl: '/club' }
    })
  })

  it('calls login when try it free button is clicked', async () => {
    const wrapper = mount(LandingComponent)
    const tryItButton = wrapper.find('.primary.button')
    await tryItButton.trigger('click')
    expect(loginWithRedirectMock).toHaveBeenCalledWith({
      appState: { targetUrl: '/club' }
    })
  })
}) 