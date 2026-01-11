import { vi, beforeEach, afterEach } from 'vitest'
import { config } from '@vue/test-utils'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.resetAllMocks()
})

vi.mock('@/appInsights', () => ({
  appInsights: {
    trackEvent: vi.fn(),
    trackException: vi.fn(),
    trackTrace: vi.fn(),
    trackPageView: vi.fn()
  }
}))

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    user: { value: null },
    isAuthenticated: { value: false },
    isLoading: { value: false },
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn()
  })
}))

config.global.mocks = {
  $t: (key: string) => key,
  $route: {
    params: {},
    query: {},
    path: '/'
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }
}

global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn()
} 
