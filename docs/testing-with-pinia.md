# Testing with Pinia - Best Practices Guide

## Overview

This guide outlines best practices for testing applications that use Pinia for state management, specifically for our Vue.js application as we upgrade to the latest Pinia version.

## Table of Contents

1. [Setup](#setup)
2. [Store Testing Patterns](#store-testing-patterns)
3. [Component Testing with Stores](#component-testing-with-stores)
4. [Test Utilities](#test-utilities)
5. [Common Patterns](#common-patterns)
6. [Debugging Tips](#debugging-tips)

## Setup

### Dependencies

Ensure you have the following testing dependencies:

```json
{
  "devDependencies": {
    "@pinia/testing": "^0.1.6",
    "@vue/test-utils": "^2.4.2",
    "vitest": "^3.0.2"
  }
}
```

### Test Configuration

Configure Vitest with proper setup for Pinia testing:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      thresholds: {
        'src/stores/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
})
```

## Store Testing Patterns

### 1. Testing Store Actions

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePathfinderStore } from '@/stores/pathfinders'
import { mockApiResponse, createMockPathfinder } from '@/utils/test-helpers'
import api from '@/api/pathfinders'

vi.mock('@/api/pathfinders')

describe('Pathfinder Store Actions', () => {
  let store: ReturnType<typeof usePathfinderStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePathfinderStore()
    vi.clearAllMocks()
  })

  it('fetches pathfinders successfully', async () => {
    const mockData = [createMockPathfinder()]
    vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(mockData))

    await store.getPathfinders()

    expect(store.pathfinders).toEqual(mockData)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(false)
  })
})
```

### 2. Testing Store Getters

```typescript
describe('Pathfinder Store Getters', () => {
  beforeEach(() => {
    store.pathfinders = [
      createMockPathfinder({ grade: 5 }),
      createMockPathfinder({ grade: 6 }),
      createMockPathfinder({ grade: 5 })
    ]
  })

  it('filters pathfinders by grade', () => {
    const grade5Pathfinders = store.getPathfindersByGrade(5)
    expect(grade5Pathfinders).toHaveLength(2)
  })
})
```

### 3. Testing Error Handling

```typescript
it('handles API errors gracefully', async () => {
  vi.mocked(api.getAll).mockRejectedValue(new Error('Network error'))
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  await store.getPathfinders()

  expect(store.error).toBe(true)
  expect(store.loading).toBe(false)
  
  consoleSpy.mockRestore()
})
```

### 4. Testing Loading States

```typescript
it('manages loading state correctly', async () => {
  const promise = store.getPathfinders()
  expect(store.loading).toBe(true)
  
  await promise
  expect(store.loading).toBe(false)
})
```

## Component Testing with Stores

### 1. Using Real Stores

```typescript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyComponent from '@/components/MyComponent.vue'

const createWrapper = () => {
  return mount(MyComponent, {
    global: {
      plugins: [createPinia()]
    }
  })
}

describe('Component with Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('integrates with store correctly', () => {
    const wrapper = createWrapper()
    // Test component behavior with real store
  })
})
```

### 2. Using @pinia/testing (When Available)

```typescript
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(MyComponent, {
  global: {
    plugins: [createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        pathfinders: {
          pathfinders: [createMockPathfinder()],
          loading: false,
          error: false
        }
      }
    })]
  }
})
```

### 3. Store Interaction Testing

```typescript
it('calls store action when form is submitted', async () => {
  const store = usePathfinderStore()
  const spy = vi.spyOn(store, 'postPathfinder').mockResolvedValue()
  
  const wrapper = createWrapper()
  
  // Trigger form submission
  await wrapper.find('form').trigger('submit')
  
  expect(spy).toHaveBeenCalledWith(expect.objectContaining({
    firstName: 'Test',
    lastName: 'User'
  }))
})
```

## Test Utilities

### Mock Factories

Create reusable mock factories for consistent test data:

```typescript
// test-helpers.ts
export const createMockPathfinder = (overrides = {}) => ({
  pathfinderID: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Test',
  lastName: 'Pathfinder',
  email: 'test@example.com',
  grade: 6,
  pathfinderHonors: [],
  ...overrides
})

export const createMockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { headers: {} }
})
```

### Store State Assertions

```typescript
export function expectStoreState<T>(store: T, expectedState: Partial<T>) {
  Object.keys(expectedState).forEach(key => {
    const expectedValue = expectedState[key as keyof T]
    if (expectedValue !== undefined) {
      expect(store[key]).toEqual(expectedValue)
    }
  })
}
```

## Common Patterns

### 1. Testing Store Dependencies

When stores depend on other stores:

```typescript
it('interacts with other stores correctly', () => {
  const pathfinderStore = usePathfinderStore()
  const selectionStore = useSelectionStore()
  
  selectionStore.selections.plan.pathfinders = ['1', '2']
  pathfinderStore.pathfinders = [
    createMockPathfinder({ pathfinderID: '1' }),
    createMockPathfinder({ pathfinderID: '2' })
  ]
  
  const selected = pathfinderStore.getPathfindersBySelection('plan')
  expect(selected).toHaveLength(2)
})
```

### 2. Testing Async Operations

```typescript
it('handles concurrent async operations', async () => {
  const promises = [
    store.getPathfinders(),
    store.getPathfinderById('123')
  ]
  
  await Promise.all(promises)
  
  expect(store.loading).toBe(false)
})
```

### 3. Testing State Persistence

```typescript
it('persists state correctly', () => {
  store.pathfinders = [createMockPathfinder()]
  
  // Simulate page reload
  const newStore = usePathfinderStore()
  
  // With pinia-plugin-persist, state should be restored
  expect(newStore.pathfinders).toEqual(store.pathfinders)
})
```

### 4. Testing Reactive Updates

```typescript
it('updates reactively when store changes', async () => {
  const wrapper = createWrapper()
  const store = usePathfinderStore()
  
  store.pathfinders = [createMockPathfinder({ firstName: 'Alice' })]
  await wrapper.vm.$nextTick()
  
  expect(wrapper.text()).toContain('Alice')
})
```

## Debugging Tips

### 1. Using Vue DevTools

- Install Vue DevTools browser extension
- Enable Pinia tab for store inspection
- Use time-travel debugging for complex state flows

### 2. Console Debugging

```typescript
it('debugs store state', () => {
  console.log('Store state:', store.$state)
  console.log('Pathfinders:', store.pathfinders)
  // Useful for debugging test failures
})
```

### 3. Snapshot Testing

```typescript
it('matches store state snapshot', () => {
  store.pathfinders = [createMockPathfinder()]
  expect(store.$state).toMatchSnapshot()
})
```

### 4. Testing Store Subscriptions

```typescript
it('triggers subscriptions on state change', () => {
  const callback = vi.fn()
  store.$subscribe(callback)
  
  store.pathfinders = [createMockPathfinder()]
  
  expect(callback).toHaveBeenCalled()
})
```

## Migration from Vuex Testing

### Before (Vuex)
```typescript
const store = createStore({
  modules: { pathfinders }
})

wrapper = mount(Component, {
  global: {
    plugins: [store]
  }
})

// Testing mutations
store.commit('SET_PATHFINDERS', mockData)
```

### After (Pinia)
```typescript
const pinia = createPinia()
setActivePinia(pinia)
const store = usePathfinderStore()

wrapper = mount(Component, {
  global: {
    plugins: [pinia]
  }
})

// Direct state updates
store.pathfinders = mockData
```

## Performance Considerations

### 1. Mock Heavy Operations

```typescript
// Mock expensive computations in getters
const expensiveComputationSpy = vi.spyOn(store, 'expensiveGetter')
  .mockReturnValue(mockResult)
```

### 2. Batch State Updates

```typescript
// Use $patch for multiple updates
store.$patch({
  pathfinders: mockData,
  loading: false,
  error: null
})
```

### 3. Cleanup Resources

```typescript
afterEach(() => {
  vi.resetAllMocks()
  // Clean up any subscriptions or timers
})
```

## Best Practices Summary

1. **Test Store Logic Separately**: Unit test stores independently from components
2. **Use Real Stores When Possible**: Avoid over-mocking; test integration
3. **Mock External Dependencies**: Always mock API calls and external services
4. **Test Error States**: Ensure error handling is thoroughly tested
5. **Verify Loading States**: Test loading indicators and state transitions
6. **Use Factories**: Create reusable mock data factories
7. **Test Reactivity**: Verify that components react to store changes
8. **Document Edge Cases**: Include tests for unusual scenarios
9. **Maintain High Coverage**: Aim for 90%+ coverage on store code
10. **Keep Tests Fast**: Use appropriate mocking to avoid slow integration tests

## Future Improvements

As we continue to upgrade and improve our testing practices:

1. Consider implementing property-based testing for complex state transitions
2. Add automated visual regression testing for components that depend on store state
3. Implement store integration tests for critical user workflows
4. Set up automated testing for store performance and memory usage
5. Create custom Vue Test Utils plugins for common testing patterns

This guide should evolve as our testing practices mature and new patterns emerge. 