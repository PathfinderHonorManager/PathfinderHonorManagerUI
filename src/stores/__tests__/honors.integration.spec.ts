import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useHonorStore } from '@/stores/honors'
import { API_CONFIG } from '@/config/api'

const server = setupServer()
const baseUrl = `${API_CONFIG.BASE_URL}/honors`

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Honor store integration', () => {
  it('fetches honors from the API', async () => {
    server.use(
      http.get(baseUrl, () =>
        HttpResponse.json([
          {
            honorID: '1',
            name: 'Animal Tracking',
            level: 1,
            description: 'Track animals',
            pathPath: 'https://example.com/animal',
            wikiPath: 'https://example.com/wiki'
          }
        ])
      )
    )

    setActivePinia(createPinia())
    const store = useHonorStore()

    await store.getHonors()

    expect(store.honors).toHaveLength(1)
    expect(store.getHonorsByQuery('animal')).toHaveLength(1)
  })
})
