import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ManageAchievementsComponent from '../ManageAchievementsComponent.vue'
import { usePathfinderStore } from '@/stores/pathfinders'
import { useAchievementsStore } from '@/stores/achievements'
import achievementsApi from '@/api/achievements'
import flushPromises from 'flush-promises'

// Mock the API
vi.mock('@/api/achievements', () => ({
  default: {
    postPathfinderAchievement: vi.fn(),
    putPathfinderAchievement: vi.fn(),
    postPathfinderAchievementsForGrade: vi.fn(),
    getAllAchievements: vi.fn(),
    getAllPathfinderAchievements: vi.fn()
  }
}))

const mockAchievementsApi = vi.mocked(achievementsApi)

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/achievements/:className',
      name: 'Achievements',
      component: ManageAchievementsComponent,
      props: true
    },
    {
      path: '/achievements',
      name: 'AchievementClasses',
      component: { template: '<div>Mock Class Selection</div>' }
    }
  ]
})

describe('ManageAchievementsComponent', () => {
  let pinia: ReturnType<typeof createPinia>
  let pathfinderStore: ReturnType<typeof usePathfinderStore>
  let achievementsStore: ReturnType<typeof useAchievementsStore>

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    pathfinderStore = usePathfinderStore()
    achievementsStore = useAchievementsStore()
    
    // Mock API responses
    mockAchievementsApi.getAllAchievements.mockResolvedValue({
      data: [
        {
          achievementID: '1',
          description: 'Test Achievement 1',
          grade: 10,
          level: 1,
          levelName: 'Basic',
          achievementSequenceOrder: 1,
          className: 'Guide',
          categoryName: 'Category 1',
          categorySequenceOrder: 1
        },
        {
          achievementID: '2',
          description: 'Test Achievement 2',
          grade: 10,
          level: 2,
          levelName: 'Advanced',
          achievementSequenceOrder: 2,
          className: 'Guide',
          categoryName: 'Category 1',
          categorySequenceOrder: 1
        }
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    })
    
    mockAchievementsApi.getAllPathfinderAchievements.mockResolvedValue({
      data: [
        {
          pathfinderAchievementID: '1',
          pathfinderID: '1',
          achievementID: '1',
          isAchieved: true,
          createTimestamp: '2023-01-01',
          achieveTimestamp: '2023-01-01',
          level: 1,
          levelName: 'Basic',
          achievementSequenceOrder: 1,
          grade: 10,
          className: 'Guide',
          description: 'Test Achievement 1',
          categoryName: 'Category 1',
          categorySequenceOrder: 1
        }
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    })
    
    // Hydrate stores BEFORE mounting
    pathfinderStore.pathfinders = [
      {
        pathfinderID: '1',
        firstName: 'John',
        lastName: 'Doe',
        grade: 10,
        className: 'Guide',
        pathfinderHonors: []
      },
      {
        pathfinderID: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        grade: 10,
        className: 'Guide',
        pathfinderHonors: []
      }
    ]
    
    achievementsStore.achievements = [
      {
        achievementID: '1',
        description: 'Test Achievement 1',
        grade: 10,
        level: 1,
        levelName: 'Basic',
        achievementSequenceOrder: 1,
        className: 'Guide',
        categoryName: 'Category 1',
        categorySequenceOrder: 1
      },
      {
        achievementID: '2',
        description: 'Test Achievement 2',
        grade: 10,
        level: 2,
        levelName: 'Advanced',
        achievementSequenceOrder: 2,
        className: 'Guide',
        categoryName: 'Category 1',
        categorySequenceOrder: 1
      }
    ]
    
    achievementsStore.pathfinderAchievements = [
      {
        pathfinderAchievementID: '1',
        pathfinderID: '1',
        achievementID: '1',
        isAchieved: true,
        createTimestamp: '2023-01-01',
        achieveTimestamp: '2023-01-01',
        level: 1,
        levelName: 'Basic',
        achievementSequenceOrder: 1,
        grade: 10,
        className: 'Guide',
        description: 'Test Achievement 1',
        categoryName: 'Category 1',
        categorySequenceOrder: 1
      }
    ]
    
    await router.push({ name: 'Achievements', params: { className: 'Guide' } })
  })

  it('renders the component with correct title', async () => {
    const wrapper = mount(ManageAchievementsComponent, {
      global: {
        plugins: [router, pinia]
      },
      props: {
        className: 'Guide'
      }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h2').text()).toBe('Guide Achievements')
  })

  it('displays back link to class selection', async () => {
    const wrapper = mount(ManageAchievementsComponent, {
      global: {
        plugins: [router, pinia]
      },
      props: {
        className: 'Guide'
      }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const backLink = wrapper.find('.back-link')
    expect(backLink.exists()).toBe(true)
    expect(backLink.text()).toBe('Back to Class Selection')
  })

  it('renders achievements with correct information', async () => {
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const achievementDescriptions = wrapper.findAll('.achievement-description')
    expect(achievementDescriptions).toHaveLength(2)
    expect(achievementDescriptions[0].text()).toBe('Test Achievement 1')
    expect(achievementDescriptions[1].text()).toBe('Test Achievement 2')
  })

  it('displays category and level badges', async () => {
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const categoryBadges = wrapper.findAll('.category-badge')
    const levelBadges = wrapper.findAll('.level-badge')
    expect(categoryBadges).toHaveLength(2)
    expect(levelBadges).toHaveLength(2)
    expect(categoryBadges[0].text()).toBe('Category 1')
    expect(levelBadges[0].text()).toBe('Basic')
    expect(levelBadges[1].text()).toBe('Advanced')
  })

  it('renders pathfinder names in header', async () => {
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const pathfinderNames = wrapper.findAll('.pathfinder-name')
    expect(pathfinderNames).toHaveLength(2)
    expect(pathfinderNames[0].text()).toBe('John D.')
    expect(pathfinderNames[1].text()).toBe('Jane S.')
  })

  it('renders checkboxes for each pathfinder', async () => {
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('handles checkbox changes correctly', async () => {
    mockAchievementsApi.putPathfinderAchievement.mockResolvedValue({
      data: achievementsStore.pathfinderAchievements[0],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    })
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const firstCheckbox = wrapper.find('input[type="checkbox"]')
    expect(firstCheckbox.exists()).toBe(true)
    await firstCheckbox.setValue(false)
    expect(mockAchievementsApi.putPathfinderAchievement).toHaveBeenCalled()
  })

  it('reverts checkbox on API error', async () => {
    mockAchievementsApi.putPathfinderAchievement.mockRejectedValue(new Error('API Error'))
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const firstCheckbox = wrapper.find('input[type="checkbox"]')
    expect(firstCheckbox.exists()).toBe(true)
    await firstCheckbox.setValue(false)
    expect((firstCheckbox.element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.text()).toContain('Failed to update achievement')
  })

  it('does not render checkboxes for pathfinders with non-matching grade', async () => {
    pathfinderStore.pathfinders.push({
      pathfinderID: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      grade: 11,
      className: 'Guide',
      pathfinderHonors: []
    })
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    // Mobile layout shows checkboxes for each pathfinder per achievement, so 2 achievements * 2 pathfinders = 4
    // Desktop layout also shows checkboxes, so total is 8 (4 mobile + 4 desktop)
    expect(checkboxes.length).toBe(8)
  })

  it('shows loading state when auto-adding achievements', async () => {
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    
    // Set loading state after mounting
    achievementsStore.loading = true
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading achievements...')
  })

  it('shows error state when there is an error', async () => {
    // Set error state before mounting
    achievementsStore.error = 'Test error message'
    // Mock loadAllAchievements to do nothing
    achievementsStore.loadAllAchievements = vi.fn()
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.find('.error').text()).toBe('Test error message')
  })

  it('filters pathfinders by matching grade', async () => {
    pathfinderStore.pathfinders.push({
      pathfinderID: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      grade: 11,
      className: 'Guide',
      pathfinderHonors: []
    })
    const wrapper = mount(ManageAchievementsComponent, {
      global: { plugins: [router, pinia] },
      props: { className: 'Guide' }
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    // Only grade 10 pathfinders should be rendered in the grid
    const pathfinderNames = wrapper.findAll('.pathfinder-name')
    expect(pathfinderNames).toHaveLength(2)
  })
}) 