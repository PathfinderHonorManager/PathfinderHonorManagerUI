import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../users'
import clubApi from '@/api/clubs'
import { jwtDecode } from 'jwt-decode'
import { 
  mockApiResponse,
  expectStoreState
} from '@/utils/test-helpers'

vi.mock('@/api/clubs')
vi.mock('jwt-decode')

describe('User Store', () => {
  let store: ReturnType<typeof useUserStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useUserStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('has correct initial state structure', () => {
      expectStoreState(store, {
        permissions: [],
        clubCode: '',
        clubName: ''
      })
    })
  })

  describe('Actions - setPermissions', () => {
    it('updates permissions array', () => {
      const mockPermissions = ['create:pathfinders', 'update:pathfinders', 'delete:pathfinders']
      
      store.setPermissions(mockPermissions)
      
      expect(store.permissions).toEqual(mockPermissions)
    })

    it('handles empty permissions array', () => {
      store.setPermissions([])
      
      expect(store.permissions).toEqual([])
    })

    it('overwrites existing permissions', () => {
      store.permissions = ['old:permission'] as any
      const newPermissions = ['new:permission1', 'new:permission2']
      
      store.setPermissions(newPermissions)
      
      expect(store.permissions).toEqual(newPermissions)
    })

    it('handles complex permission objects', () => {
      const complexPermissions = [
        { action: 'create', resource: 'pathfinders' },
        { action: 'read', resource: 'honors' }
      ]
      
      store.setPermissions(complexPermissions)
      
      expect(store.permissions).toEqual(complexPermissions)
    })
  })

  describe('Actions - setClubCode', () => {
    it('updates club code', () => {
      const clubCode = 'ABC123'
      
      store.setClubCode(clubCode)
      
      expect(store.clubCode).toBe(clubCode)
    })

    it('handles empty club code', () => {
      store.setClubCode('')
      
      expect(store.clubCode).toBe('')
    })

    it('overwrites existing club code', () => {
      store.clubCode = 'OLD123'
      
      store.setClubCode('NEW456')
      
      expect(store.clubCode).toBe('NEW456')
    })

    it('handles special characters in club code', () => {
      const specialCode = 'CLUB-2024@TEST'
      
      store.setClubCode(specialCode)
      
      expect(store.clubCode).toBe(specialCode)
    })
  })

  describe('Actions - setClubName', () => {
    it('updates club name', () => {
      const clubName = 'Awesome Pathfinders Club'
      
      store.setClubName(clubName)
      
      expect(store.clubName).toBe(clubName)
    })

    it('handles empty club name', () => {
      store.setClubName('')
      
      expect(store.clubName).toBe('')
    })

    it('overwrites existing club name', () => {
      store.clubName = 'Old Club Name'
      
      store.setClubName('New Club Name')
      
      expect(store.clubName).toBe('New Club Name')
    })

    it('handles long club names', () => {
      const longName = 'This is a very long pathfinder club name that tests how the store handles extended text'
      
      store.setClubName(longName)
      
      expect(store.clubName).toBe(longName)
    })
  })

  describe('Actions - getClubName', () => {
    it('successfully fetches and sets club name', async () => {
      const mockClubData = { name: 'Test Pathfinder Club' }
      const clubCode = 'TEST123'
      
      vi.mocked(clubApi.getClub).mockResolvedValue(mockApiResponse(mockClubData))
      
      await store.getClubName(clubCode)
      
      expect(clubApi.getClub).toHaveBeenCalledWith({ clubcode: clubCode })
      expect(store.clubName).toBe(mockClubData.name)
    })

    it('handles API errors gracefully', async () => {
      const errorMessage = 'Club not found'
      const clubCode = 'INVALID'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      vi.mocked(clubApi.getClub).mockRejectedValue(new Error(errorMessage))
      
      await store.getClubName(clubCode)
      
      expect(clubApi.getClub).toHaveBeenCalledWith({ clubcode: clubCode })
      expect(store.clubName).toBe('') // Should remain unchanged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not get club name')
      )
      
      consoleSpy.mockRestore()
    })

    it('does not modify state on API failure', async () => {
      store.clubName = 'Original Club Name'
      
      vi.mocked(clubApi.getClub).mockRejectedValue(new Error('Network error'))
      
      await store.getClubName('TEST123')
      
      expect(store.clubName).toBe('Original Club Name')
    })

    it('handles empty club code parameter', async () => {
      const mockClubData = { name: 'Default Club' }
      
      vi.mocked(clubApi.getClub).mockResolvedValue(mockApiResponse(mockClubData))
      
      await store.getClubName('')
      
      expect(clubApi.getClub).toHaveBeenCalledWith({ clubcode: '' })
    })
  })

  describe('Actions - decodeToken', () => {
    const mockGetAccessTokenSilently = vi.fn()

    beforeEach(() => {
      mockGetAccessTokenSilently.mockClear()
    })

    it('successfully decodes token and sets user data', async () => {
      const mockToken = 'mock.jwt.token'
      const mockDecodedToken = {
        permissions: ['create:pathfinders', 'read:honors'],
        clubCode: 'ABC123'
      }
      const mockClubData = { name: 'Test Club' }
      
      mockGetAccessTokenSilently.mockResolvedValue(mockToken)
      vi.mocked(jwtDecode).mockReturnValue(mockDecodedToken)
      vi.mocked(clubApi.getClub).mockResolvedValue(mockApiResponse(mockClubData))
      
      await store.decodeToken(mockGetAccessTokenSilently)
      
      expect(mockGetAccessTokenSilently).toHaveBeenCalledOnce()
      expect(jwtDecode).toHaveBeenCalledWith(mockToken)
      expect(store.permissions).toEqual(mockDecodedToken.permissions)
      expect(store.clubCode).toBe(mockDecodedToken.clubCode)
      expect(store.clubName).toBe(mockClubData.name)
    })

    it('handles token retrieval failure', async () => {
      const errorMessage = 'Failed to get token'
      mockGetAccessTokenSilently.mockRejectedValue(new Error(errorMessage))
      
      await expect(store.decodeToken(mockGetAccessTokenSilently)).rejects.toThrow(errorMessage)
      
      expect(store.permissions).toEqual([])
      expect(store.clubCode).toBe('')
      expect(store.clubName).toBe('')
    })

    it('handles token decode failure', async () => {
      const mockToken = 'invalid.jwt.token'
      mockGetAccessTokenSilently.mockResolvedValue(mockToken)
      vi.mocked(jwtDecode).mockImplementation(() => {
        throw new Error('Invalid token')
      })
      
      await expect(store.decodeToken(mockGetAccessTokenSilently)).rejects.toThrow('Invalid token')
      
      expect(store.permissions).toEqual([])
      expect(store.clubCode).toBe('')
    })

    it('continues even if club name fetch fails', async () => {
      const mockToken = 'mock.jwt.token'
      const mockDecodedToken = {
        permissions: ['create:pathfinders'],
        clubCode: 'ABC123'
      }
      
      mockGetAccessTokenSilently.mockResolvedValue(mockToken)
      vi.mocked(jwtDecode).mockReturnValue(mockDecodedToken)
      vi.mocked(clubApi.getClub).mockRejectedValue(new Error('Club API error'))
      
      await store.decodeToken(mockGetAccessTokenSilently)
      
      expect(store.permissions).toEqual(mockDecodedToken.permissions)
      expect(store.clubCode).toBe(mockDecodedToken.clubCode)
      expect(store.clubName).toBe('') // Should remain empty due to API error
    })

    it('handles missing properties in decoded token', async () => {
      const mockToken = 'mock.jwt.token'
      const incompleteToken = {
        permissions: ['read:data']
        // Missing clubCode
      }
      
      mockGetAccessTokenSilently.mockResolvedValue(mockToken)
      vi.mocked(jwtDecode).mockReturnValue(incompleteToken)
      
      await store.decodeToken(mockGetAccessTokenSilently)
      
      expect(store.permissions).toEqual(incompleteToken.permissions)
      expect(store.clubCode).toBeUndefined()
    })
  })

  describe('Edge Cases', () => {
    it('handles null and undefined values gracefully', () => {
      store.setPermissions(null as any)
      expect(store.permissions).toBeNull()
      
      store.setClubCode(undefined as any)
      expect(store.clubCode).toBeUndefined()
      
      store.setClubName(null as any)
      expect(store.clubName).toBeNull()
    })

    it('handles very large permissions arrays', () => {
      const largePermissions = Array.from({ length: 1000 }, (_, i) => `permission:${i}`)
      
      store.setPermissions(largePermissions)
      
      expect(store.permissions).toHaveLength(1000)
      expect(store.permissions[999]).toBe('permission:999')
    })

    it('handles Unicode characters in club names', () => {
      const unicodeName = 'Pathfinders Club 🏕️ ⭐ 🎯'
      
      store.setClubName(unicodeName)
      
      expect(store.clubName).toBe(unicodeName)
    })
  })

  describe('State Reactivity', () => {
    it('maintains reactivity when permissions change', async () => {
      const permissions = ['create:pathfinders']
      
      store.setPermissions(permissions)
      
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(store.permissions).toEqual(permissions)
    })

    it('maintains state consistency across multiple operations', async () => {
      const mockToken = 'mock.jwt.token'
      const mockDecodedToken = {
        permissions: ['full:access'],
        clubCode: 'FULL123'
      }
      const mockClubData = { name: 'Full Access Club' }
      
      vi.fn().mockResolvedValue(mockToken)
      vi.mocked(jwtDecode).mockReturnValue(mockDecodedToken)
      vi.mocked(clubApi.getClub).mockResolvedValue(mockApiResponse(mockClubData))
      
      store.setPermissions(['initial:permission'])
      store.setClubCode('INITIAL')
      store.setClubName('Initial Club')
      
      expect(store.permissions).toEqual(['initial:permission'])
      expect(store.clubCode).toBe('INITIAL')
      expect(store.clubName).toBe('Initial Club')
    })
  })

  describe('Integration Scenarios', () => {
    it('supports complete user authentication flow', async () => {
      const mockGetAccessTokenSilently = vi.fn()
      const mockToken = 'complete.jwt.token'
      const mockDecodedToken = {
        permissions: ['create:pathfinders', 'update:pathfinders', 'read:honors'],
        clubCode: 'INTEGRATION123'
      }
      const mockClubData = { name: 'Integration Test Club' }
      
      mockGetAccessTokenSilently.mockResolvedValue(mockToken)
      vi.mocked(jwtDecode).mockReturnValue(mockDecodedToken)
      vi.mocked(clubApi.getClub).mockResolvedValue(mockApiResponse(mockClubData))
      
      // Initial state
      expect(store.permissions).toEqual([])
      expect(store.clubCode).toBe('')
      expect(store.clubName).toBe('')
      
      // Authentication flow
      await store.decodeToken(mockGetAccessTokenSilently)
      
      // Final state
      expect(store.permissions).toEqual(mockDecodedToken.permissions)
      expect(store.clubCode).toBe(mockDecodedToken.clubCode)
      expect(store.clubName).toBe(mockClubData.name)
    })

    it('supports manual state management', () => {
      // Manual setup
      store.setPermissions(['manual:permission'])
      store.setClubCode('MANUAL123')
      store.setClubName('Manually Set Club')
      
      expect(store.permissions).toEqual(['manual:permission'])
      expect(store.clubCode).toBe('MANUAL123')
      expect(store.clubName).toBe('Manually Set Club')
      
      // Update individual pieces
      store.setPermissions(['updated:permission'])
      expect(store.permissions).toEqual(['updated:permission'])
      expect(store.clubCode).toBe('MANUAL123') // Unchanged
      expect(store.clubName).toBe('Manually Set Club') // Unchanged
    })
  })

  describe('Performance', () => {
    it('handles rapid state changes efficiently', () => {
      const start = performance.now()
      
      for (let i = 0; i < 100; i++) {
        store.setPermissions([`permission:${i}`])
        store.setClubCode(`CLUB${i}`)
        store.setClubName(`Club ${i}`)
      }
      
      const end = performance.now()
      
      expect(store.permissions).toEqual(['permission:99'])
      expect(store.clubCode).toBe('CLUB99')
      expect(store.clubName).toBe('Club 99')
      expect(end - start).toBeLessThan(50) // Should be very fast
    })
  })
}) 