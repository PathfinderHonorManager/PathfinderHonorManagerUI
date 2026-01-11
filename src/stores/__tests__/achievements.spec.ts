import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAchievementsStore } from '@/stores/achievements'
import achievementsApi from '@/api/achievements'
import type { AchievementDto, PathfinderAchievementDto } from '@/api/achievements'

// Mock the API
vi.mock('@/api/achievements', () => ({
  default: {
    getAllAchievements: vi.fn(),
    getAllPathfinderAchievements: vi.fn()
  }
}))

const mockAchievementsApi = vi.mocked(achievementsApi)

describe('Achievements Store', () => {
  let store: ReturnType<typeof useAchievementsStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useAchievementsStore()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      expect(store.achievements).toEqual([])
      expect(store.pathfinderAchievements).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      store.achievements = [
        { achievementID: '1', description: 'Test 1', grade: 5, level: 1, levelName: 'Basic', achievementSequenceOrder: 1, className: 'Friend', categoryName: 'Category 1', categorySequenceOrder: 1 },
        { achievementID: '2', description: 'Test 2', grade: 5, level: 2, levelName: 'Advanced', achievementSequenceOrder: 2, className: 'Friend', categoryName: 'Category 1', categorySequenceOrder: 1 },
        { achievementID: '3', description: 'Test 3', grade: 6, level: 1, levelName: 'Basic', achievementSequenceOrder: 1, className: 'Companion', categoryName: 'Category 2', categorySequenceOrder: 2 }
      ]
      store.pathfinderAchievements = [
        { pathfinderAchievementID: '1', pathfinderID: 'pf1', achievementID: '1', isAchieved: true, createTimestamp: '2023-01-01', achieveTimestamp: '2023-01-01', level: 1, levelName: 'Basic', achievementSequenceOrder: 1, grade: 5, className: 'Friend', description: 'Test 1', categoryName: 'Category 1', categorySequenceOrder: 1 },
        { pathfinderAchievementID: '2', pathfinderID: 'pf1', achievementID: '2', isAchieved: false, createTimestamp: '2023-01-01', achieveTimestamp: null, level: 2, levelName: 'Advanced', achievementSequenceOrder: 2, grade: 5, className: 'Friend', description: 'Test 2', categoryName: 'Category 1', categorySequenceOrder: 1 }
      ]
    })

    it('getAchievementById returns correct achievement', () => {
      const achievement = store.getAchievementById('1')
      expect(achievement).toEqual(store.achievements[0])
    })

    it('getAchievementById returns undefined for non-existent achievement', () => {
      const achievement = store.getAchievementById('999')
      expect(achievement).toBeUndefined()
    })

    it('getPathfinderAchievementsByClass returns correct achievements', () => {
      const achievements = store.getPathfinderAchievementsByClass('Friend')
      expect(achievements).toHaveLength(2)
      expect(achievements[0].achievementID).toBe('1')
      expect(achievements[1].achievementID).toBe('2')
    })

    it('getPathfinderAchievementsByClass returns empty array for non-existent class', () => {
      const achievements = store.getPathfinderAchievementsByClass('NonExistent')
      expect(achievements).toEqual([])
    })

    it('getPathfinderAchievementsByGrade returns correct achievements', () => {
      const achievements = store.getPathfinderAchievementsByGrade(5)
      expect(achievements).toHaveLength(2)
      expect(achievements[0].achievementID).toBe('1')
      expect(achievements[1].achievementID).toBe('2')
    })

    it('getPathfinderAchievementsByGrade returns empty array for non-existent grade', () => {
      const achievements = store.getPathfinderAchievementsByGrade(999)
      expect(achievements).toEqual([])
    })
  })

  describe('Actions', () => {
    describe('loadAllAchievements', () => {
      it('loads achievements successfully', async () => {
        const mockAchievements: AchievementDto[] = [
          { achievementID: '1', description: 'Test 1', grade: 5, level: 1, levelName: 'Basic', achievementSequenceOrder: 1, className: 'Friend', categoryName: 'Category 1', categorySequenceOrder: 1 }
        ]
        const mockPathfinderAchievements: PathfinderAchievementDto[] = [
          { pathfinderAchievementID: '1', pathfinderID: 'pf1', achievementID: '1', isAchieved: true, createTimestamp: '2023-01-01', achieveTimestamp: '2023-01-01', level: 1, levelName: 'Basic', achievementSequenceOrder: 1, grade: 5, className: 'Friend', description: 'Test 1', categoryName: 'Category 1', categorySequenceOrder: 1 }
        ]

        mockAchievementsApi.getAllAchievements.mockResolvedValue({ 
          data: mockAchievements,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>
        })
        mockAchievementsApi.getAllPathfinderAchievements.mockResolvedValue({ 
          data: mockPathfinderAchievements,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>
        })

        await store.loadAllAchievements()

        expect(store.achievements).toEqual(mockAchievements)
        expect(store.pathfinderAchievements).toEqual(mockPathfinderAchievements)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('handles errors gracefully', async () => {
        const error = new Error('API Error')
        mockAchievementsApi.getAllAchievements.mockRejectedValue(error)

        await store.loadAllAchievements()

        expect(store.error).toBe('Failed to load achievements')
        expect(store.loading).toBe(false)
      })

      it('skips loading if achievements already exist and forceReload is false', async () => {
        store.achievements = [{ achievementID: '1', description: 'Test', grade: 5, level: 1, levelName: 'Basic', achievementSequenceOrder: 1, className: 'Friend', categoryName: 'Category 1', categorySequenceOrder: 1 }]

        await store.loadAllAchievements()

        expect(mockAchievementsApi.getAllAchievements).not.toHaveBeenCalled()
        expect(mockAchievementsApi.getAllPathfinderAchievements).not.toHaveBeenCalled()
      })

      it('forces reload when forceReload is true', async () => {
        store.achievements = [{ achievementID: '1', description: 'Test', grade: 5, level: 1, levelName: 'Basic', achievementSequenceOrder: 1, className: 'Friend', categoryName: 'Category 1', categorySequenceOrder: 1 }]
        
        const mockAchievements: AchievementDto[] = [{ achievementID: '2', description: 'New Test', grade: 5, level: 1, levelName: 'Basic', achievementSequenceOrder: 1, className: 'Friend', categoryName: 'Category 1', categorySequenceOrder: 1 }]
        const mockPathfinderAchievements: PathfinderAchievementDto[] = []

        mockAchievementsApi.getAllAchievements.mockResolvedValue({ 
          data: mockAchievements,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>
        })
        mockAchievementsApi.getAllPathfinderAchievements.mockResolvedValue({ 
          data: mockPathfinderAchievements,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>
        })

        await store.loadAllAchievements(true)

        expect(mockAchievementsApi.getAllAchievements).toHaveBeenCalled()
        expect(mockAchievementsApi.getAllPathfinderAchievements).toHaveBeenCalled()
        expect(store.achievements).toEqual(mockAchievements)
      })
    })
  })
}) 
