import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ManageInvestitureComponent from '../ManageInvestitureComponent.vue'
import { useSelectionStore } from '@/stores/selectionStore'
import pathfindersApi from '@/api/pathfinders'
import flushPromises from 'flush-promises'

const mockAchievementsStore = {
  loadAllAchievements: vi.fn()
}

vi.mock('@/api/pathfinders', () => ({
  default: {
    getAll: vi.fn(),
    bulkUpdatePathfinders: vi.fn()
  }
}))

vi.mock('@/stores/achievements', () => ({
  useAchievementsStore: () => mockAchievementsStore
}))

const mockPathfindersApi = vi.mocked(pathfindersApi)

describe('ManageInvestitureComponent', () => {
  const pathfinders = [
    { pathfinderID: '1', firstName: 'Anna', lastName: 'Active', grade: 5, isActive: true },
    { pathfinderID: '2', firstName: 'Ben', lastName: 'Border', grade: 11, isActive: true },
    { pathfinderID: '3', firstName: 'Cara', lastName: 'TooLow', grade: 4, isActive: true },
    { pathfinderID: '4', firstName: 'Dan', lastName: 'Staff', grade: null, isActive: true },
    { pathfinderID: '5', firstName: 'Eli', lastName: 'TooHigh', grade: 12, isActive: true }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    mockAchievementsStore.loadAllAchievements.mockReset()
    mockPathfindersApi.getAll.mockReset()
    mockPathfindersApi.bulkUpdatePathfinders.mockReset()
  })

  it('loads and renders only active pathfinders with grades 5-11', async () => {
    mockPathfindersApi.getAll.mockResolvedValue({ data: pathfinders })

    const wrapper = mount(ManageInvestitureComponent, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ToasterComponent: true
        }
      }
    })

    await flushPromises()

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Anna Active')
    expect(rows[1].text()).toContain('Ben Border')
  })

  it('selects and clears all active pathfinders from the header checkbox', async () => {
    mockPathfindersApi.getAll.mockResolvedValue({ data: pathfinders })

    const wrapper = mount(ManageInvestitureComponent, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ToasterComponent: true
        }
      }
    })

    await flushPromises()

    const selectionStore = useSelectionStore()
    const toggleAll = wrapper.find('thead input[type="checkbox"]')

    await toggleAll.setValue(true)
    expect(selectionStore.selections.investiture.pathfinders).toEqual(['1', '2'])

    await toggleAll.setValue(false)
    expect(selectionStore.selections.investiture.pathfinders).toEqual([])
  })

  it('promotes selected pathfinders and refreshes achievements', async () => {
    mockPathfindersApi.getAll.mockResolvedValue({ data: pathfinders })
    mockPathfindersApi.bulkUpdatePathfinders.mockResolvedValue({
      status: 207,
      data: [{ status: 200, pathfinderId: '1' }, { status: 200, pathfinderId: '2' }]
    })

    const wrapper = mount(ManageInvestitureComponent, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ToasterComponent: true
        }
      }
    })

    await flushPromises()

    const selectionStore = useSelectionStore()
    selectionStore.selections.investiture.pathfinders = ['1', '2']

    await wrapper.vm.promoteSelected()
    await flushPromises()

    expect(mockPathfindersApi.bulkUpdatePathfinders).toHaveBeenCalledWith([
      {
        items: [
          { pathfinderId: '1', grade: 6, isActive: true },
          { pathfinderId: '2', grade: 12, isActive: true }
        ]
      }
    ])
    expect(mockAchievementsStore.loadAllAchievements).toHaveBeenCalledWith(true)
    expect(selectionStore.selections.investiture.pathfinders).toEqual([])
    expect(wrapper.vm.selectAll).toBe(false)
    expect(wrapper.vm.toasterMessage).toContain('Successfully promoted')
  })

  it('shows an error when no valid pathfinders are selected', async () => {
    mockPathfindersApi.getAll.mockResolvedValue({ data: pathfinders })

    const wrapper = mount(ManageInvestitureComponent, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ToasterComponent: true
        }
      }
    })

    await flushPromises()

    const selectionStore = useSelectionStore()
    selectionStore.selections.investiture.pathfinders = ['missing']

    await wrapper.vm.promoteSelected()

    expect(wrapper.vm.error).toBe('No valid pathfinders to update')
  })
})
