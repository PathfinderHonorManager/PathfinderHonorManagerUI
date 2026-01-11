import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PathfinderHonorComponent from '../PathfinderHonorComponent.vue'
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
      expect(wrapper.find('.honor-card').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('Test Honor')
      expect(wrapper.find('img').attributes('src'))
        .toContain('https://images.pathfinderclub.tools/assets/honors/small/test.jpg')
    })

    it('does not render when display is false', async () => {
      await wrapper.setProps({ display: false })
      expect(wrapper.find('.honor-card').exists()).toBe(false)
    })

    it('renders status selector with correct options', async () => {
      const statusSelector = wrapper.find('.status-selector')
      expect(statusSelector.exists()).toBe(true)
      
      await statusSelector.trigger('click')
      await wrapper.vm.$nextTick()
      
      const options = wrapper.findAll('.dropdown-option')
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
      const statusSelector = wrapper.find('.status-selector')
      await statusSelector.trigger('click')
      await wrapper.vm.$nextTick()
      
      const earnedOption = wrapper.find('.dropdown-option.earned')
      await earnedOption.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.newStatus).toBe('Earned')
    })

    it('computes correct color based on status', async () => {
      const statusSelector = wrapper.find('.status-selector')
      expect(statusSelector.classes()).toContain('planned')
      
      await statusSelector.trigger('click')
      await wrapper.vm.$nextTick()
      
      const earnedOption = wrapper.find('.dropdown-option.earned')
      await earnedOption.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.status-selector').classes()).toContain('earned')
    })
  })

  describe('User Interactions', () => {
    it('enables update button when status changes', async () => {
      const statusSelector = wrapper.find('.status-selector')
      await statusSelector.trigger('click')
      await wrapper.vm.$nextTick()
      
      const earnedOption = wrapper.find('.dropdown-option.earned')
      await earnedOption.trigger('click')
      await wrapper.vm.$nextTick()
      
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeUndefined()
    })

    it('disables update button when status is unchanged', () => {
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('calls putPathfinderHonor when button is clicked', async () => {
      const statusSelector = wrapper.find('.status-selector')
      await statusSelector.trigger('click')
      await wrapper.vm.$nextTick()
      
      const earnedOption = wrapper.find('.dropdown-option.earned')
      await earnedOption.trigger('click')
      await wrapper.vm.$nextTick()
      
      const button = wrapper.find('button')
      await button.trigger('click')
      
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
      const statusSelector = wrapper.find('.status-selector')
      expect(statusSelector.exists()).toBe(true)
      
      const button = wrapper.find('button')
      expect(button.text()).toContain('Update Status')
    })

    it('has accessible images', () => {
      const img = wrapper.find('img')
      expect(img.classes()).toContain('patch-image')
      expect(img.attributes('src')).toContain('test.jpg')
    })
  })
}) 
