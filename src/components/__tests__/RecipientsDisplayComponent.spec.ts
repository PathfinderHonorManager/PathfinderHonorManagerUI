import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RecipientsDisplayComponent from '../RecipientsDisplayComponent.vue'

const mockSelectionStore = {
  selections: {
    plan: { pathfinders: [], honors: [] },
    earn: { pathfinders: [], honors: [] },
    award: { pathfinders: [], honors: [] },
    investiture: { pathfinders: [], honors: [] }
  },
  toggleSelection: vi.fn(),
  isSelected: vi.fn((type: string, id: string) => mockSelectionStore.selections[type].pathfinders.includes(id))
}

const mockPathfinderStore = {
  pathfinders: [],
  getPathfindersBySelection: vi.fn(() => [])
}

const mockHonorStore = {
  getHonorsBySelection: vi.fn(() => [{ honorID: 'honor-1' }])
}

vi.mock('@/stores/selectionStore', () => ({
  useSelectionStore: () => mockSelectionStore
}))

vi.mock('@/stores/pathfinders', () => ({
  usePathfinderStore: () => mockPathfinderStore
}))

vi.mock('@/stores/honors', () => ({
  useHonorStore: () => mockHonorStore
}))

describe('RecipientsDisplayComponent', () => {
  beforeEach(() => {
    mockSelectionStore.toggleSelection.mockReset()
    mockSelectionStore.selections.plan.pathfinders = []
    mockSelectionStore.selections.earn.pathfinders = []
    mockSelectionStore.selections.award.pathfinders = []
  })

  it('marks plan-eligible pathfinders and toggles selection', async () => {
    mockPathfinderStore.pathfinders = [
      {
        pathfinderID: 'pf-1',
        firstName: 'Alice',
        lastName: 'Able',
        pathfinderHonors: [{ honorID: 'honor-1', status: 'Planned' }]
      },
      {
        pathfinderID: 'pf-2',
        firstName: 'Bob',
        lastName: 'Baker',
        pathfinderHonors: [{ honorID: 'honor-2', status: 'Planned' }]
      }
    ]

    const wrapper = mount(RecipientsDisplayComponent, {
      props: {
        selectionType: 'plan'
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].classes()).toContain('is-ineligible')
    expect(buttons[1].classes()).toContain('is-light-grey')

    await buttons[0].trigger('click')
    expect(mockSelectionStore.toggleSelection).not.toHaveBeenCalled()

    await buttons[1].trigger('click')
    expect(mockSelectionStore.toggleSelection).toHaveBeenCalledWith('plan', 'pf-2', 'pathfinders')
  })

  it('checks eligibility for earn and award flows', async () => {
    mockPathfinderStore.pathfinders = [
      {
        pathfinderID: 'pf-1',
        firstName: 'Alice',
        lastName: 'Able',
        pathfinderHonors: [{ honorID: 'honor-1', status: 'Planned' }]
      },
      {
        pathfinderID: 'pf-2',
        firstName: 'Bob',
        lastName: 'Baker',
        pathfinderHonors: [{ honorID: 'honor-1', status: 'Earned' }]
      }
    ]

    const earnWrapper = mount(RecipientsDisplayComponent, {
      props: {
        selectionType: 'earn'
      }
    })
    expect(earnWrapper.vm.isEligible('pf-1')).toBe(true)
    expect(earnWrapper.vm.isEligible('pf-2')).toBe(false)

    const awardWrapper = mount(RecipientsDisplayComponent, {
      props: {
        selectionType: 'award'
      }
    })
    expect(awardWrapper.vm.isEligible('pf-1')).toBe(false)
    expect(awardWrapper.vm.isEligible('pf-2')).toBe(true)
  })
})
