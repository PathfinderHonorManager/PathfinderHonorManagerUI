import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useHonorStore } from '@/stores/honors'
import { useUserStore } from '@/stores/users'
import { useAchievementsStore } from '@/stores/achievements'

// Mock Auth0
vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: vi.fn()
}))

// Mock stores
vi.mock('@/stores/honors', () => ({
  useHonorStore: vi.fn()
}))

vi.mock('@/stores/users', () => ({
  useUserStore: vi.fn()
}))

vi.mock('@/stores/achievements', () => ({
  useAchievementsStore: vi.fn()
}))

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    currentRoute: { value: { name: 'landing' } }
  }),
  RouterLink: {
    template: '<a><slot /></a>'
  },
  RouterView: {
    template: '<div>Router View</div>'
  }
}))

describe('App.vue', () => {
  let mockAuth0: ReturnType<typeof useAuth0>
  let mockHonorStore: ReturnType<typeof useHonorStore>
  let mockUserStore: ReturnType<typeof useUserStore>
  let mockAchievementsStore: ReturnType<typeof useAchievementsStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    // Setup Auth0 mock
    mockAuth0 = {
      isAuthenticated: { value: false },
      isLoading: { value: false },
      getAccessTokenSilently: vi.fn()
    } as ReturnType<typeof useAuth0>
    vi.mocked(useAuth0).mockReturnValue(mockAuth0)

    // Setup store mocks
    mockHonorStore = {
      getHonors: vi.fn()
    } as ReturnType<typeof useHonorStore>
    vi.mocked(useHonorStore).mockReturnValue(mockHonorStore)

    mockUserStore = {
      decodeToken: vi.fn(),
      permissions: []
    } as ReturnType<typeof useUserStore>
    vi.mocked(useUserStore).mockReturnValue(mockUserStore)

    mockAchievementsStore = {
      loadAllAchievements: vi.fn()
    } as ReturnType<typeof useAchievementsStore>
    vi.mocked(useAchievementsStore).mockReturnValue(mockAchievementsStore)

    vi.clearAllMocks()
  })

  describe('Authentication Flow', () => {
    it('should not load honors during authentication', async () => {
      mockAuth0.isAuthenticated.value = true
      mockAuth0.isLoading.value = false
      mockUserStore.decodeToken.mockResolvedValue(undefined)

      mount(App, {
        global: {
          plugins: [createPinia()],
          stubs: {
            Authentication: true,
            UserProfileComponent: true,
            SidebarVersionInfo: true,
            RouterView: true
          }
        }
      })

      // Wait for the next tick to allow watchEffect to run
      await new Promise(resolve => setTimeout(resolve, 10))

      // Honors should not be loaded during authentication
      expect(mockHonorStore.getHonors).not.toHaveBeenCalled()
      
      // User token should be decoded
      expect(mockUserStore.decodeToken).toHaveBeenCalledWith(mockAuth0.getAccessTokenSilently)
    })

    it('should redirect to club when authenticated and on landing page', async () => {
      mockAuth0.isAuthenticated.value = true
      mockAuth0.isLoading.value = false
      mockUserStore.decodeToken.mockResolvedValue(undefined)

      mount(App, {
        global: {
          plugins: [createPinia()],
          stubs: {
            Authentication: true,
            UserProfileComponent: true,
            SidebarVersionInfo: true,
            RouterView: true
          }
        }
      })

      // Wait for the next tick to allow watchEffect to run
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should redirect to club
      expect(mockPush).toHaveBeenCalledWith({ name: 'club' })
    })

    it('should not load achievements on mount', async () => {
      mockAuth0.isAuthenticated.value = false
      mockAuth0.isLoading.value = false

      mount(App, {
        global: {
          plugins: [createPinia()],
          stubs: {
            Authentication: true,
            UserProfileComponent: true,
            SidebarVersionInfo: true,
            RouterView: true
          }
        }
      })

      // Wait for the next tick to allow onMounted to run
      await new Promise(resolve => setTimeout(resolve, 10))

      // Achievements should not be loaded on mount
      expect(mockAchievementsStore.loadAllAchievements).not.toHaveBeenCalled()
    })

    it('should handle authentication errors gracefully', async () => {
      mockAuth0.isAuthenticated.value = true
      mockAuth0.isLoading.value = false
      mockUserStore.decodeToken.mockRejectedValue(new Error('Auth error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mount(App, {
        global: {
          plugins: [createPinia()],
          stubs: {
            Authentication: true,
            UserProfileComponent: true,
            SidebarVersionInfo: true,
            RouterView: true
          }
        }
      })

      // Wait for the next tick to allow watchEffect to run
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(consoleSpy).toHaveBeenCalledWith('Auth error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
}) 
