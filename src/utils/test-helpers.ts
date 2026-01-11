import { expect } from 'vitest'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import type { Url } from 'url'

export function mockApiResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as AxiosRequestConfig,
    request: {}
  }
}

export function mockApiError(message: string, status = 500) {
  const error = new Error(message)
  ;(error as Error & { status?: number }).status = status
  return Promise.reject(error)
}

export const createMockPathfinder = (overrides = {}) => ({
  pathfinderID: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Test',
  lastName: 'Pathfinder',
  email: 'test@example.com',
  className: 'Friend',
  grade: 6,
  pathfinderHonors: [],
  ...overrides
})

export const createMockHonor = (overrides = {}) => ({
  honorID: '456e7890-e89b-12d3-a456-426614174001',
  name: 'Test Honor',
  level: 1,
  description: 'Test honor description',
  pathPath: new URL('https://example.com/test-honor') as unknown as Url,
  wikiPath: new URL('https://wiki.example.com/test-honor') as unknown as Url,
  ...overrides
})

export const createMockPathfinderHonor = (overrides = {}) => ({
  pathfinderHonorID: '789e0123-e89b-12d3-a456-426614174002',
  pathfinderID: '123e4567-e89b-12d3-a456-426614174000',
  honorID: '456e7890-e89b-12d3-a456-426614174001',
  name: 'Test Honor',
  status: 'Planned',
  patchPath: 'test_honor.png',
  ...overrides
})

export const waitForStoreUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

export function expectStoreState<T extends Record<string, unknown>>(store: T, expectedState: Partial<T>) {
  Object.keys(expectedState).forEach(key => {
    const expectedValue = expectedState[key as keyof T]
    if (expectedValue !== undefined) {
      expect(store[key]).toEqual(expectedValue)
    }
  })
}

export function createMockStore<T extends Record<string, unknown>>(initialState: T) {
  const state = { ...initialState }
  
  return {
    ...state,
    $patch: (updates: Partial<T>) => {
      Object.assign(state, updates)
    },
    $reset: () => {
      Object.assign(state, initialState)
    },
    $state: state
  }
} 
