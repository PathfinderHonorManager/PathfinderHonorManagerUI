import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectedHonorsDisplayComponent from '../SelectedHonorsDisplayComponent.vue'

const mockSelectionStore = {
  selections: {
    plan: { honors: ['honor-1'] },
    earn: { honors: [] },
    award: { honors: [] }
  },
  toggleSelection: vi.fn()
}

const mockHonorStore = {
  honors: [
    { honorID: 'honor-1', name: 'Honor One' },
    { honorID: 'honor-2', name: 'Honor Two' }
  ]
}

vi.mock('@/stores/selectionStore', () => ({
  useSelectionStore: () => mockSelectionStore
}))

vi.mock('@/stores/honors', () => ({
  useHonorStore: () => mockHonorStore
}))

describe('SelectedHonorsDisplayComponent', () => {
  beforeEach(() => {
    mockSelectionStore.toggleSelection.mockReset()
    mockSelectionStore.selections.plan.honors = ['honor-1']
  })

  it('renders selected honors and toggles selection', async () => {
    const wrapper = mount(SelectedHonorsDisplayComponent, {
      props: {
        selectionType: 'plan'
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0].text()).toContain('Honor One')

    await buttons[0].trigger('click')
    expect(mockSelectionStore.toggleSelection).toHaveBeenCalledWith('plan', 'honor-1', 'honors')
  })

  it('shows empty state when no honors selected', () => {
    mockSelectionStore.selections.plan.honors = []

    const wrapper = mount(SelectedHonorsDisplayComponent, {
      props: {
        selectionType: 'plan'
      }
    })

    expect(wrapper.text()).toContain('No honors selected')
  })
})
