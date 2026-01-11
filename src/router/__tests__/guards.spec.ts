import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import type { Ref } from 'vue'
import { handleAuthNavigation } from '../index'

describe('Router guards', () => {
  const makeAuthState = (authenticated: boolean, loading = false) => ({
    isAuthenticated: { value: authenticated } as Ref<boolean>,
    isLoading: { value: loading } as Ref<boolean>
  })

  const makeRoute = (overrides: Partial<RouteLocationNormalized> = {}) =>
    ({
      name: undefined,
      path: '/',
      meta: {},
      ...overrides
    }) as RouteLocationNormalized

  afterEach(() => {
    vi.useRealTimers()
  })

  it('redirects unauthenticated users to landing for protected routes', async () => {
    const next = vi.fn() as NavigationGuardNext
    const to = makeRoute({ name: 'club', meta: { requiresAuth: true } })

    await handleAuthNavigation(to, makeAuthState(false), next)

    expect(next).toHaveBeenCalledWith({ name: 'landing' })
  })

  it('redirects authenticated users away from landing', async () => {
    const next = vi.fn() as NavigationGuardNext
    const to = makeRoute({ name: 'landing', path: '/landing' })

    await handleAuthNavigation(to, makeAuthState(true), next)

    expect(next).toHaveBeenCalledWith({ name: 'club' })
  })

  it('allows authenticated users to access protected routes', async () => {
    const next = vi.fn() as NavigationGuardNext
    const to = makeRoute({ name: 'ManageHonors', meta: { requiresAuth: true } })

    await handleAuthNavigation(to, makeAuthState(true), next)

    expect(next).toHaveBeenCalledWith()
  })

  it('allows navigation when auth is still loading after delay', async () => {
    vi.useFakeTimers()
    const next = vi.fn() as NavigationGuardNext
    const authState = makeAuthState(false, true)
    const to = makeRoute({ name: 'club', meta: { requiresAuth: true } })

    const pending = handleAuthNavigation(to, authState, next)
    await vi.advanceTimersByTimeAsync(500)
    await pending

    expect(next).toHaveBeenCalledWith()
  })
})
