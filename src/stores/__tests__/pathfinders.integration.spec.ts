import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { usePathfinderStore } from '@/stores/pathfinders'
import { API_CONFIG } from '@/config/api'

const server = setupServer()
const baseUrl = `${API_CONFIG.BASE_URL}/pathfinders`

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Pathfinder store integration', () => {
  it('loads and sorts honors from the API', async () => {
    server.use(
      http.get(baseUrl, () =>
        HttpResponse.json([
          {
            pathfinderID: '1',
            firstName: 'Pat',
            lastName: 'Finder',
            className: 'Friend',
            grade: 5,
            pathfinderHonors: [
              { honorID: '2', name: 'Zebra', status: 'Planned', patchFilename: 'z.png', pathfinderHonorID: 'ph-2', pathfinderID: '1' },
              { honorID: '1', name: 'Alpha', status: 'Planned', patchFilename: 'a.png', pathfinderHonorID: 'ph-1', pathfinderID: '1' }
            ]
          }
        ])
      )
    )

    setActivePinia(createPinia())
    const store = usePathfinderStore()

    await store.getPathfinders()

    expect(store.pathfinders).toHaveLength(1)
    expect(store.pathfinders[0].pathfinderHonors.map((h) => h.name)).toEqual(['Alpha', 'Zebra'])
  })
})
