import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ManageHonorsComponent from '../ManageHonorsComponent.vue'
import { ref, computed } from 'vue'
import type { IHonor } from '@/stores/honors'
import flushPromises from 'flush-promises'
import type { Url } from 'url'

const mockHonors: IHonor[] = [
  {
    honorID: '1',
    name: 'Honor 1',
    level: 1,
    description: 'Test honor 1',
    pathPath: new URL('https://example.com/1') as unknown as Url,
    wikiPath: new URL('https://wiki.example.com/1') as unknown as Url
  },
  {
    honorID: '2',
    name: 'Honor 2',
    level: 2,
    description: 'Test honor 2',
    pathPath: new URL('https://example.com/2') as unknown as Url,
    wikiPath: new URL('https://wiki.example.com/2') as unknown as Url
  }
]

const mockPathfinderStore = {
  pathfinders: ref([{
    pathfinderID: '1',
    firstName: 'John',
    lastName: 'Doe',
    pathfinderHonors: [
      { honorID: '1', status: 'Planned', name: 'Honor 1' },
      { honorID: '2', status: 'Earned', name: 'Honor 2' }
    ]
  }]).value,
  getPathfinders: vi.fn(),
  getPathfindersBySelection: vi.fn().mockReturnValue([]),
  plannedHonors: computed(() => [{ honorID: '1', name: 'Honor 1' }]),
  earnedHonors: computed(() => [{ honorID: '2', name: 'Honor 2' }])
}

const mockHonorStore = {
  honors: ref(mockHonors),
  loading: ref(false),
  error: ref(false),
  getHonors: vi.fn(),
  getHonorsBySelection: vi.fn().mockReturnValue([]),
  getHonorsByQuery: vi.fn()
}

const mockSelectionStore = {
  selections: {
    plan: { pathfinders: [], honors: [] },
    earn: { pathfinders: [], honors: [] },
    award: { pathfinders: [], honors: [] }
  },
  toggleSelection: vi.fn()
}

vi.mock('@/stores/pathfinders', () => ({
  usePathfinderStore: () => mockPathfinderStore
}))

vi.mock('@/stores/honors', () => ({
  useHonorStore: () => mockHonorStore
}))

vi.mock('@/stores/selectionStore', () => ({
  useSelectionStore: () => mockSelectionStore
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    inject: vi.fn((key) => {
      if (key === 'usePathfinderStore') return () => mockPathfinderStore
      if (key === 'useHonorStore') return () => mockHonorStore
      return undefined
    })
  }
})

describe('ManageHonorsComponent', () => {
  let wrapper: VueWrapper
  let router
  type MountOptions = Parameters<typeof mount>[1]
  let globalMountOptions: MountOptions

  beforeEach(async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    mockHonorStore.getHonorsBySelection.mockReturnValue([])
    mockHonorStore.getHonors.mockClear()
    mockPathfinderStore.getPathfinders.mockClear()
    mockHonorStore.getHonors.mockImplementation(() => Promise.resolve())
    mockPathfinderStore.getPathfinders.mockImplementation(() => Promise.resolve())

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', redirect: '/manage/plan' },
        { path: '/manage/:selectionType', name: 'manage', component: ManageHonorsComponent },
        { path: '/manage/plan', name: 'plan', component: ManageHonorsComponent },
        { path: '/manage/earn', name: 'earn', component: ManageHonorsComponent },
        { path: '/manage/award', name: 'award', component: ManageHonorsComponent }
      ]
    })

    await router.push('/manage/plan')
    await router.isReady()

    globalMountOptions = {
      global: {
        plugins: [router, pinia],
        stubs: {
          HonorSearchComponent: true,
          HonorsDisplayComponent: true,
          SelectedHonorsDisplayComponent: {
            template: '<div>SelectedHonorsDisplayComponent Stub</div>',
            props: ['selectionType']
          },
          RecipientsDisplayComponent: {
            template: '<div>RecipientsDisplayComponent Stub</div>',
            props: ['selectionType']
          },
          ToasterComponent: true
        }
      }
    }

    wrapper = mount(ManageHonorsComponent, globalMountOptions)
  })

  describe('Error Handling', () => {
    it('handles loading state', async () => {
      mockHonorStore.loading.value = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.html()).toContain('Loading Honors')
    })
  })

  describe('Initial Data Loading', () => {
    it('only loads empty stores', async () => {
      mockHonorStore.honors.value = [mockHonors[0]]
      mockPathfinderStore.pathfinders = []
      
      wrapper.unmount()
      wrapper = mount(ManageHonorsComponent, globalMountOptions)
      
      await flushPromises()
      
      expect(mockHonorStore.getHonors).not.toHaveBeenCalled()
      expect(mockPathfinderStore.getPathfinders).toHaveBeenCalled()
    })
  })
}) 
