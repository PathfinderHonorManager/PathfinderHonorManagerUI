import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHonorStore } from '@/stores/honors'
import { useSelectionStore } from '@/stores/selectionStore'
import api from '@/api/honors'
import { 
  mockApiResponse, 
  createMockHonor,
  expectStoreState
} from '@/utils/test-helpers'
import type { IHonor } from '@/stores/honors'
import type { SelectionType } from '@/stores/selectionStore'
import type { Url } from 'url'

vi.mock('@/api/honors')

describe('Honor Store', () => {
  let store: ReturnType<typeof useHonorStore>
  let selectionStore: ReturnType<typeof useSelectionStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useHonorStore()
    selectionStore = useSelectionStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  const mockHonors: IHonor[] = [
    {
      honorID: "1c82e3ae-1968-11ec-ae66-d7248c0cf660",
      name: "Animal Tracking",
      level: 1,
      description: "Learn to identify and track various animals",
      pathPath: new URL("https://example.com/animal-tracking") as unknown as Url,
      wikiPath: new URL("https://wiki.example.com/animal-tracking") as unknown as Url,
    },
    {
      honorID: "1c82e688-1968-11ec-ae66-8f33c066236e", 
      name: "Barbering and Hairstyling",
      level: 2,
      description: "Learn basic barbering and hairstyling techniques",
      pathPath: new URL("https://example.com/barbering") as unknown as Url,
      wikiPath: new URL("https://wiki.example.com/barbering") as unknown as Url,
    },
    {
      honorID: "1c82e4e4-1968-11ec-ae66-376e19f0534f",
      name: "Archery",
      level: 1,
      description: "Master the art of archery",
      pathPath: new URL("https://example.com/archery") as unknown as Url,
      wikiPath: new URL("https://wiki.example.com/archery") as unknown as Url,
    },
  ]

  describe('Initial State', () => {
    it('has correct initial state structure', () => {
      expectStoreState(store, {
        honors: [],
        loading: false,
        error: false
      })
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      store.honors = mockHonors
    })

    it('getHonorsByLevel filters correctly', () => {
      const level1Honors = store.getHonorsByLevel(1)
      expect(level1Honors).toHaveLength(2)
      expect(level1Honors.map(h => h.name)).toEqual(['Animal Tracking', 'Archery'])
    })

    it('getHonorsByLevel returns empty array for non-existent level', () => {
      const level5Honors = store.getHonorsByLevel(5)
      expect(level5Honors).toEqual([])
    })

    it('getHonorsByQuery filters by single term', () => {
      const trackingHonors = store.getHonorsByQuery('tracking')
      expect(trackingHonors).toHaveLength(1)
      expect(trackingHonors[0].name).toBe('Animal Tracking')
    })

    it('getHonorsByQuery filters by multiple terms', () => {
      const animalHonors = store.getHonorsByQuery('animal tracking')
      expect(animalHonors).toHaveLength(1)
      expect(animalHonors[0].name).toBe('Animal Tracking')
    })

    it('getHonorsByQuery is case insensitive', () => {
      const archeryHonors = store.getHonorsByQuery('ARCHERY')
      expect(archeryHonors).toHaveLength(1)
      expect(archeryHonors[0].name).toBe('Archery')
    })

    it('getHonorsByQuery returns empty array for no matches', () => {
      const noMatches = store.getHonorsByQuery('nonexistent honor')
      expect(noMatches).toEqual([])
    })

    it('getHonorsBySelection works with selection store for plan', () => {
      selectionStore.selections.plan.honors = [mockHonors[0].honorID, mockHonors[2].honorID]
      
      const selectedHonors = store.getHonorsBySelection('plan')
      expect(selectedHonors).toHaveLength(2)
      expect(selectedHonors.map(h => h.name)).toEqual(['Animal Tracking', 'Archery'])
    })

    it('getHonorsBySelection works with selection store for earn', () => {
      selectionStore.selections.earn.honors = [mockHonors[1].honorID]
      
      const selectedHonors = store.getHonorsBySelection('earn')
      expect(selectedHonors).toHaveLength(1)
      expect(selectedHonors[0].name).toBe('Barbering and Hairstyling')
    })

    it('getHonorsBySelection returns empty array when no selections', () => {
      const selectedHonors = store.getHonorsBySelection('plan')
      expect(selectedHonors).toEqual([])
    })

    it('getHonorsBySelection handles invalid selection type gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const selectedHonors = store.getHonorsBySelection('invalid' as unknown as SelectionType)
      expect(selectedHonors).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Selection type invalid is not valid')
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Actions - getHonors', () => {
    it('successfully fetches and stores honors', async () => {
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(mockHonors))

      expect(store.loading).toBe(false)
      
      const promise = store.getHonors()
      expect(store.loading).toBe(true)
      
      await promise
      
      expect(store.honors).toEqual(mockHonors)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(false)
      expect(api.getAll).toHaveBeenCalledOnce()
    })

    it('handles API errors gracefully', async () => {
      const errorMessage = 'Network error'
      vi.mocked(api.getAll).mockRejectedValue(new Error(errorMessage))
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.getHonors()

      expect(store.honors).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not get honors')
      )
      
      consoleSpy.mockRestore()
    })

    it('ensures loading state is always reset on error', async () => {
      vi.mocked(api.getAll).mockRejectedValue(new Error('Test error'))
      
      await store.getHonors()
      
      expect(store.loading).toBe(false)
    })

    it('resets error state on successful fetch', async () => {
      store.error = true
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(mockHonors))
      
      await store.getHonors()
      
      expect(store.error).toBe(false)
    })

    it('loads honors data when store is empty', async () => {
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(mockHonors))
      
      await store.getHonors()
      
      expect(api.getAll).toHaveBeenCalled()
      expect(store.honors).toEqual(mockHonors)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(false)
    })

    it('reloads honors data when called multiple times', async () => {
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(mockHonors))
      
      await store.getHonors()
      await store.getHonors()
      
      expect(api.getAll).toHaveBeenCalledTimes(2)
    })

    it('handles API errors gracefully', async () => {
      const error = new Error('API Error')
      vi.mocked(api.getAll).mockRejectedValue(error)
      
      await store.getHonors()
      
      expect(store.error).toBe(true)
      expect(store.loading).toBe(false)
      expect(store.honors).toEqual([])
    })
  })

  describe('Edge Cases', () => {
    it('handles empty honors list gracefully', () => {
      expect(store.getHonorsByLevel(1)).toEqual([])
      expect(store.getHonorsByQuery('test')).toEqual([])
      expect(store.getHonorsBySelection('plan')).toEqual([])
    })

    it('handles query with special characters', () => {
      store.honors = [
        createMockHonor({ name: 'Arts & Crafts' })
      ]
      
      const results = store.getHonorsByQuery('arts & crafts')
      expect(results).toHaveLength(1)
    })

    it('handles query with extra spaces', () => {
      store.honors = [
        createMockHonor({ name: 'Animal Tracking' })
      ]
      
      const results = store.getHonorsByQuery('  animal   tracking  ')
      expect(results).toHaveLength(1)
    })

    it('handles missing selection store data gracefully', () => {
      selectionStore.selections.plan.honors = []
      
      const selectedHonors = store.getHonorsBySelection('plan')
      expect(selectedHonors).toEqual([])
    })
  })

  describe('State Reactivity', () => {
    it('maintains reactivity when honors are updated', async () => {
      const initialHonor = createMockHonor({ honorID: '1', name: 'Test Honor' })
      store.honors = [initialHonor]

      const updatedHonor = { ...initialHonor, name: 'Updated Honor' }
      store.honors[0] = updatedHonor

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(store.honors[0].name).toBe('Updated Honor')
    })

    it('getters update when underlying state changes', () => {
      store.honors = [createMockHonor({ level: 1 })]
      expect(store.getHonorsByLevel(1)).toHaveLength(1)
      
      store.honors.push(createMockHonor({ level: 1 }))
      expect(store.getHonorsByLevel(1)).toHaveLength(2)
    })

    it('getters update when selection store changes', () => {
      const honor = createMockHonor({ honorID: 'test-id' })
      store.honors = [honor]
      
      expect(store.getHonorsBySelection('plan')).toHaveLength(0)
      
      selectionStore.selections.plan.honors = ['test-id']
      expect(store.getHonorsBySelection('plan')).toHaveLength(1)
    })
  })

  describe('Performance', () => {
    it('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => 
        createMockHonor({ 
          honorID: `honor-${i}`,
          name: `Honor ${i}`,
          level: (i % 5) + 1
        })
      )
      
      store.honors = largeDataset
      
      const start = performance.now()
      const level1Honors = store.getHonorsByLevel(1)
      const queryResults = store.getHonorsByQuery('Honor 1')
      const end = performance.now()
      
      expect(level1Honors.length).toBeGreaterThan(0)
      expect(queryResults.length).toBeGreaterThan(0)
      expect(end - start).toBeLessThan(100) // Should be fast
    })
  })
}) 
