import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PostPathfinderHonorComponent from '../PostPathfinderHonorComponent.vue'
import { usePathfinderStore } from '@/stores/pathfinders'
import { useHonorStore } from '@/stores/honors'
import { ref } from 'vue'
import api from '@/api/pathfinders'

vi.mock('@/api/pathfinders', () => ({
  default: {
    postPathfinderHonor: vi.fn()
  }
}))

const mockPathfinderStore = {
  pathfinders: ref([{
    pathfinderID: '123',
    firstName: 'John',
    lastName: 'Doe',
    pathfinderHonors: [
      { honorID: '1', status: 'Planned', name: 'Honor 1' }
    ]
  }]),
  loading: ref(false),
  error: ref(false),
  getPathfinderById: vi.fn()
}

const mockHonorStore = {
  honors: ref([
    { honorID: '1', name: 'Honor 1' },
    { honorID: '2', name: 'Honor 2' }
  ])
}

vi.mock('@/stores/pathfinders', () => ({
  usePathfinderStore: () => mockPathfinderStore
}))

vi.mock('@/stores/honors', () => ({
  useHonorStore: () => mockHonorStore
}))

describe('PostPathfinderHonorComponent', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()

    wrapper = mount(PostPathfinderHonorComponent, {
      props: {
        pathfinderID: '123'
      },
      global: {
        plugins: [pinia],
        stubs: {
          'vue3-simple-typeahead': {
            template: '<div><input type="text" /><div class="typeahead-options"></div></div>',
            props: ['items', 'item-projection', 'item-class', 'item-disabled'],
            methods: {
              selectItem: vi.fn()
            }
            }
        }
      }
    })
  })

  describe('Component Rendering', () => {
    it('renders properly with all props', () => {
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('Add Honor to Pathfinder')
    })
  })

  describe('Honor Addition', () => {
    it('successfully adds a new honor', async () => {
      vi.mocked(api.postPathfinderHonor).mockResolvedValue({})
      
      await wrapper.vm.handleSubmit()
      
      expect(api.postPathfinderHonor).toHaveBeenCalledWith('123', {
        honorID: '',
        status: 'Planned'
      })
      expect(wrapper.vm.showToast).toBe(true)
      expect(wrapper.vm.toastMessage).toBe('Honor successfully added')
      expect(mockPathfinderStore.getPathfinderById).toHaveBeenCalledWith('123')
    })

    it('shows error toast when honor addition fails', async () => {
      vi.mocked(api.postPathfinderHonor).mockRejectedValue(new Error('Failed to add honor'))
      
      await wrapper.vm.handleSubmit()
      
      expect(wrapper.vm.showToast).toBe(true)
      expect(wrapper.vm.toastMessage).toBe('Failed to add honor')
    })
  })

  describe('Search Input', () => {
    it('clears search input after successful honor addition', async () => {
      vi.mocked(api.postPathfinderHonor).mockResolvedValue({})
      
      await wrapper.vm.handleSubmit()
      
      expect(wrapper.vm.postHonorID).toBe('')
    })
  })
}) 