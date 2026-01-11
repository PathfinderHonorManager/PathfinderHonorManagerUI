import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthenticationComponent from '../AuthenticationComponent.vue'
import axios from 'axios'

const getAccessTokenSilently = vi.fn()

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently
  })
}))

vi.mock('axios', () => ({
  default: {
    interceptors: {
      request: {
        use: vi.fn()
      }
    }
  }
}))

const axiosMock = axios as unknown as {
  interceptors: {
    request: {
      use: ReturnType<typeof vi.fn>
    }
  }
}

describe('AuthenticationComponent', () => {
  beforeEach(() => {
    axiosMock.interceptors.request.use.mockClear()
    getAccessTokenSilently.mockReset()
  })

  it('adds auth headers to axios requests', async () => {
    getAccessTokenSilently.mockResolvedValue('token-123')

    mount(AuthenticationComponent)

    const [onFulfilled] = axiosMock.interceptors.request.use.mock.calls[0]
    const config = { headers: {} as Record<string, string> }
    const result = await onFulfilled(config)

    expect(result.headers.Authorization).toBe('Bearer token-123')
    expect(result.headers['Content-Type']).toBe('application/json')
  })
})
