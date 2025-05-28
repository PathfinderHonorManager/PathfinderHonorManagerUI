import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ManageHonorsComponent from '../ManageHonorsComponent.vue'
import { usePathfinderStore } from '@/stores/pathfinders'
import { useHonorStore } from '@/stores/honors'
import { useSelectionStore } from '@/stores/selectionStore'
import { ref, computed } from 'vue'

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
  honors: ref([
    { honorID: '1', name: 'Honor 1' },
    { honorID: '2', name: 'Honor 2' }
  ]).value,
  loading: ref(false),
  error: ref(null),
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
  let wrapper
  let router

  beforeEach(async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

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

    wrapper = mount(ManageHonorsComponent, {
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
    })
  })

  describe('Error Handling', () => {
    it('handles loading state', async () => {
      mockHonorStore.loading.value = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.html()).toContain('Loading Honors')
    })
  })
}) 