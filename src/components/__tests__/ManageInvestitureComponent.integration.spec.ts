import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import ManageInvestitureComponent from '../ManageInvestitureComponent.vue'
import { API_CONFIG } from '@/config/api'
import flushPromises from 'flush-promises'
import { useSelectionStore } from '@/stores/selectionStore'

const server = setupServer()
const baseUrl = API_CONFIG.BASE_URL

const pathfinders = [
  { pathfinderID: '1', firstName: 'Anna', lastName: 'Active', grade: 5, isActive: true },
  { pathfinderID: '2', firstName: 'Ben', lastName: 'Border', grade: 11, isActive: true },
  { pathfinderID: '3', firstName: 'Cara', lastName: 'TooLow', grade: 4, isActive: true }
]

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ManageInvestitureComponent integration', () => {
  it('promotes selected pathfinders via the API', async () => {
    let bulkRequestBody: unknown = null

    server.use(
      http.get(`${baseUrl}/pathfinders`, () => HttpResponse.json(pathfinders)),
      http.put(`${baseUrl}/pathfinders`, async ({ request }) => {
        bulkRequestBody = await request.json()
        return HttpResponse.json(
          [
            { status: 200, pathfinderId: '1' },
            { status: 200, pathfinderId: '2' }
          ],
          { status: 207 }
        )
      }),
      http.get(`${baseUrl}/Achievements`, () => HttpResponse.json([])),
      http.get(`${baseUrl}/PathfinderAchievements`, () => HttpResponse.json([]))
    )

    setActivePinia(createPinia())

    const wrapper = mount(ManageInvestitureComponent, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ToasterComponent: true
        }
      }
    })

    await flushPromises()

    const toggleAll = wrapper.find('thead input[type="checkbox"]')
    await toggleAll.setValue(true)

    const promoteButton = wrapper.find('button.primary.button')
    await promoteButton.trigger('click')
    await flushPromises()

    expect(bulkRequestBody).toEqual([
      {
        items: [
          { pathfinderId: '1', grade: 6, isActive: true },
          { pathfinderId: '2', grade: 12, isActive: true }
        ]
      }
    ])

    const selectionStore = useSelectionStore()
    expect(selectionStore.selections.investiture.pathfinders).toEqual([])
    expect(wrapper.vm.selectAll).toBe(false)
  })
})
