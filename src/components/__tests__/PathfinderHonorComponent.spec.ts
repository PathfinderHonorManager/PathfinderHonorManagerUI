import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PathfinderHonorComponent from '../PathfinderHonorComponent.vue'
import { usePathfinderStore } from '@/stores/pathfinders'
import { ref } from 'vue'

const mockStore = {
  putPathfinderHonor: vi.fn(),
  loading: ref(false),
  error: ref(null),
  pathfinders: ref([])
}

vi.mock('@/stores/pathfinders', () => ({
  usePathfinderStore: () => ({
    ...mockStore,
    $state: {
      get loading() { return mockStore.loading.value },
      set loading(value) { mockStore.loading.value = value },
      get error() { return mockStore.error.value },
      set error(value) { mockStore.error.value = value },
      get pathfinders() { return mockStore.pathfinders.value },
      set pathfinders(value) { mockStore.pathfinders.value = value }
    }
  })
}))

describe('PathfinderHonorComponent', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    mockStore.error.value = null

    wrapper = mount(PathfinderHonorComponent, {
      props: {
        pathfinderID: '123',
        honorID: '456',
        name: 'Test Honor',
        status: 'Planned',
        display: true,
        image: 'test.jpg',
        canUpdatePathfinder: true
      },
      global: {
        plugins: [pinia]
      }
    })
  })

  describe('Component Rendering', () => {
    it('renders properly with all props', () => {
      expect(wrapper.find('#honor-info').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('Test Honor')
      expect(wrapper.find('img').attributes('src'))
        .toContain('https://images.pathfinderclub.tools/assets/honors/small/test.jpg')
    })

    it('does not render when display is false', async () => {
      await wrapper.setProps({ display: false })
      expect(wrapper.find('#honor-info').exists()).toBe(false)
    })

    it('renders status selector with correct options', () => {
      const select = wrapper.find('select')
      const options = select.findAll('option')
      
      expect(options).toHaveLength(3)
      expect(options[0].text()).toBe('Planned')
      expect(options[1].text()).toBe('Earned')
      expect(options[2].text()).toBe('Awarded')
    })
  })

  describe('Status Management', () => {
    it('initializes with correct status', () => {
      expect(wrapper.vm.newStatus).toBe('Planned')
    })

    it('updates status when selector changes', async () => {
      const select = wrapper.find('select')
      await select.setValue('Earned')
      
      expect(wrapper.vm.newStatus).toBe('Earned')
    })

    it('computes correct color based on status', async () => {
      expect(wrapper.vm.selectedColor).toBe('var(--secondaryColor)') // Planned
      
      await wrapper.find('select').setValue('Earned')
      expect(wrapper.vm.selectedColor).toBe('var(--orange)')
      
      await wrapper.find('select').setValue('Awarded')
      expect(wrapper.vm.selectedColor).toBe('mediumseagreen')
    })
  })

  describe('User Interactions', () => {
    it('enables update button when status changes', async () => {
      await wrapper.find('select').setValue('Earned')
      const button = wrapper.find('button')
      expect(button.classes()).toContain('primary')
      expect(button.attributes('style')).not.toContain('pointer-events: none')
    })

    it('disables update button when status is unchanged', () => {
      const button = wrapper.find('button')
      expect(button.classes()).not.toContain('primary')
      expect(button.attributes('style')).toContain('pointer-events: none')
    })

    it('calls putPathfinderHonor when form is submitted', async () => {
      await wrapper.find('select').setValue('Earned')
      await wrapper.find('form').trigger('submit.prevent')
      
      expect(mockStore.putPathfinderHonor).toHaveBeenCalledWith('123', '456', 'Earned')
    })
  })

  describe('Error Handling', () => {
    it('handles missing optional props', () => {
      const minimalWrapper = mount(PathfinderHonorComponent, {
        props: {
          pathfinderID: '123',
          honorID: '456',
          name: 'Test Honor',
          status: 'Planned',
          canUpdatePathfinder: true,
          display: true
        },
        global: {
          plugins: [pinia]
        }
      })
      expect(minimalWrapper.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has accessible form controls', () => {
      const select = wrapper.find('select')
      expect(select.classes()).toContain('statusselector')
      
      const button = wrapper.find('button')
      expect(button.text()).toContain('Update Status')
    })

    it('has accessible images', () => {
      const img = wrapper.find('img')
      expect(img.classes()).toContain('patchimage')
      expect(img.attributes('src')).toContain('test.jpg')
    })
  })
}) 