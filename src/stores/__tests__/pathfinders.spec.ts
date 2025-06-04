import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePathfinderStore } from '@/stores/pathfinders'
import { useSelectionStore } from '@/stores/selectionStore'
import { status } from '@/models/pathfinder'
import api from '@/api/pathfinders'
import { 
  mockApiResponse, 
  createMockPathfinder, 
  createMockPathfinderHonor,
  expectStoreState
} from '@/utils/test-helpers'

vi.mock('@/api/pathfinders')

describe('Pathfinder Store', () => {
  let store: ReturnType<typeof usePathfinderStore>
  let selectionStore: ReturnType<typeof useSelectionStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = usePathfinderStore()
    selectionStore = useSelectionStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  const mockPathfinders = [
    {
      pathfinderID: "34f93233-7c0a-48a7-81fc-2fa56473874a",
      firstName: "Sally",
      lastName: "Forth",
      email: "sally@example.com",
      className: "Friend",
      grade: 5,
      pathfinderHonors: [
        {
          pathfinderHonorID: "ada33ac7-2333-4316-9449-65f49688bafb",
          pathfinderID: "34f93233-7c0a-48a7-81fc-2fa56473874a",
          honorID: "1c82e3ae-1968-11ec-ae66-d7248c0cf660",
          name: "Animal Tracking",
          status: status.Planned,
          patchFilename: "Animal_Tracking_Honor.png",
        },
        {
          pathfinderHonorID: "95792053-6140-4ba9-b114-2bd249b62875",
          pathfinderID: "34f93233-7c0a-48a7-81fc-2fa56473874a",
          honorID: "1c82e688-1968-11ec-ae66-8f33c066236e",
          name: "Barbering and Hairstyling",
          status: status.Planned,
          patchFilename: "Barbering_Honor.png",
        },
      ],
    },
    {
      pathfinderID: "2af9f458-939c-4072-ad88-e25224412c8e",
      firstName: "Bobo",
      lastName: "TheClown",
      email: "bobo@example.com",
      className: "Explorer",
      grade: 7,
      pathfinderHonors: [
        {
          pathfinderHonorID: "16284fc0-25e8-4093-9b99-202ad5865e68",
          pathfinderID: "2af9f458-939c-4072-ad88-e25224412c8e",
          honorID: "1c82e4e4-1968-11ec-ae66-376e19f0534f",
          name: "Archery",
          status: status.Planned,
          patchFilename: "Archery_Honor.png",
        },
      ],
    },
  ]

  describe('Initial State', () => {
    it('has correct initial state structure', () => {
      expectStoreState(store, {
        pathfinders: [],
        loading: false,
        error: false
      })
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      store.pathfinders = mockPathfinders
    })

    it('getPathfindersByGrade filters correctly', () => {
      const grade5Pathfinders = store.getPathfindersByGrade(5)
      expect(grade5Pathfinders).toHaveLength(1)
      expect(grade5Pathfinders[0].firstName).toBe('Sally')
    })

    it('getPathfindersByGrade returns empty array for non-existent grade', () => {
      const grade12Pathfinders = store.getPathfindersByGrade(12)
      expect(grade12Pathfinders).toEqual([])
    })

    it('getPathfindersBySelection works with selection store', () => {
      selectionStore.selections.plan.pathfinders = [mockPathfinders[0].pathfinderID]
      
      const selectedPathfinders = store.getPathfindersBySelection('plan')
      expect(selectedPathfinders).toHaveLength(1)
      expect(selectedPathfinders[0].pathfinderID).toBe(mockPathfinders[0].pathfinderID)
    })

    it('getPathfindersBySelection returns empty array when no selections', () => {
      const selectedPathfinders = store.getPathfindersBySelection('plan')
      expect(selectedPathfinders).toEqual([])
    })
  })

  describe('Actions - getPathfinders', () => {
    it('successfully fetches and stores pathfinders', async () => {
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(mockPathfinders))

      expect(store.loading).toBe(false)
      
      const promise = store.getPathfinders()
      expect(store.loading).toBe(true)
      
      await promise
      
      expect(store.pathfinders).toEqual(mockPathfinders)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(false)
      expect(api.getAll).toHaveBeenCalledOnce()
    })

    it('handles API errors gracefully', async () => {
      const errorMessage = 'Network error'
      vi.mocked(api.getAll).mockRejectedValue(new Error(errorMessage))
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.getPathfinders()

      expect(store.pathfinders).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not get pathfinders')
      )
      
      consoleSpy.mockRestore()
    })

    it('ensures loading state is always reset', async () => {
      vi.mocked(api.getAll).mockRejectedValue(new Error('Test error'))
      
      await store.getPathfinders()
      
      expect(store.loading).toBe(false)
    })
  })

  describe('Actions - postPathfinder', () => {
    it('adds new pathfinder and refreshes list', async () => {
      const newPathfinderData = {
        firstName: 'Peter',
        lastName: 'Cottontail',
        email: 'peter@example.com',
        grade: 10
      }
      const createdPathfinder = createMockPathfinder(newPathfinderData)
      const updatedList = [...mockPathfinders, createdPathfinder]

      vi.mocked(api.post).mockResolvedValue(mockApiResponse(createdPathfinder))
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(updatedList))

      await store.postPathfinder(newPathfinderData)

      expect(api.post).toHaveBeenCalledWith(newPathfinderData)
      expect(api.getAll).toHaveBeenCalled()
      expect(store.pathfinders).toContainEqual(createdPathfinder)
    })

    it('throws error when API call fails', async () => {
      const newPathfinderData = {
        firstName: 'Peter',
        lastName: 'Cottontail',
        email: 'peter@example.com',
        grade: 10
      }
      const apiError = new Error('Validation error: Email is required')
      
      vi.mocked(api.post).mockRejectedValue(apiError)

      await expect(store.postPathfinder(newPathfinderData)).rejects.toThrow(
        'Validation error: Email is required'
      )
      expect(store.error).toBe(true)
    })

    it('sets loading state correctly on error', async () => {
      const newPathfinderData = {
        firstName: 'Peter',
        lastName: 'Cottontail',
        email: 'peter@example.com',
        grade: 10
      }

      vi.mocked(api.post).mockRejectedValue(new Error('API Error'))

      try {
        await store.postPathfinder(newPathfinderData)
      } catch (error) {
        // Expected to throw
      }

      expect(store.loading).toBe(false)
      expect(store.error).toBe(true)
    })
  })

  describe('Actions - putPathfinderHonor', () => {
    it('updates pathfinder honor status successfully', async () => {
      const pathfinderID = mockPathfinders[0].pathfinderID
      const honorToUpdate = mockPathfinders[0].pathfinderHonors[0]
      const newStatus = status.Earned

      const updatedPathfinderData = {
        ...mockPathfinders[0],
        pathfinderHonors: mockPathfinders[0].pathfinderHonors.map(honor =>
          honor.pathfinderHonorID === honorToUpdate.pathfinderHonorID
            ? { ...honor, status: newStatus }
            : honor
        ),
      }

      vi.mocked(api.putPathfinderHonor).mockResolvedValue(mockApiResponse({}))
      vi.mocked(api.get).mockResolvedValue(mockApiResponse(updatedPathfinderData))

      store.pathfinders = [mockPathfinders[0]]

      await store.putPathfinderHonor(pathfinderID, honorToUpdate.honorID, newStatus)

      expect(api.putPathfinderHonor).toHaveBeenCalledWith(
        pathfinderID,
        honorToUpdate.honorID,
        { honorID: honorToUpdate.honorID, status: newStatus }
      )
      expect(store.loading).toBe(false)
      expect(store.error).toBe(false)
    })

    it('handles update errors and throws', async () => {
      const errorMessage = 'Update failed'
      vi.mocked(api.putPathfinderHonor).mockRejectedValue(new Error(errorMessage))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        store.putPathfinderHonor('123', '456', status.Earned)
      ).rejects.toThrow(errorMessage)

      expect(store.error).toBe(true)
      expect(store.loading).toBe(false)
      
      consoleSpy.mockRestore()
    })
  })

  describe('Actions - bulkManagePathfinderHonors', () => {
    it('successfully adds multiple honors to multiple pathfinders', async () => {
      const pathfinderIDs = [mockPathfinders[0].pathfinderID, mockPathfinders[1].pathfinderID]
      const honorIDs = ['honor1', 'honor2']
      const action = 'plan'

      const mockBulkResponse = [
        {
          status: 201,
          pathfinderHonor: {
            pathfinderID: pathfinderIDs[0],
            honorID: honorIDs[0],
            status: status.Planned
          }
        },
        {
          status: 201,
          pathfinderHonor: {
            pathfinderID: pathfinderIDs[1],
            honorID: honorIDs[1],
            status: status.Planned
          }
        }
      ]

      vi.mocked(api.bulkManagePathfinderHonors).mockResolvedValue(
        mockApiResponse(mockBulkResponse)
      )
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse(mockPathfinders))

      const result = await store.bulkManagePathfinderHonors(pathfinderIDs, honorIDs, action)

      expect(api.bulkManagePathfinderHonors).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            pathfinderID: pathfinderIDs[0],
            honors: expect.arrayContaining([
              expect.objectContaining({ honorID: honorIDs[0], status: status.Planned })
            ])
          })
        ]),
        action
      )
      expect(result?.successful).toHaveLength(2)
      expect(result?.failed).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty pathfinder list gracefully', () => {
      expect(store.getPathfindersByGrade(5)).toEqual([])
      expect(store.getPathfindersBySelection('plan')).toEqual([])
    })

    it('handles invalid pathfinder ID in getPathfinderById', async () => {
      const invalidID = 'non-existent-id'
      vi.mocked(api.get).mockRejectedValue(new Error('Not found'))

      await expect(store.getPathfinderById(invalidID)).rejects.toThrow()
      expect(store.error).toBe(true)
    })

    it('handles missing honors array gracefully', () => {
      const pathfinderWithoutHonors = { ...mockPathfinders[0], pathfinderHonors: [] }
      store.pathfinders = [pathfinderWithoutHonors as any]
      
      expect(() => store.sortPathfinderHonors()).not.toThrow()
    })
  })

  describe('State Reactivity', () => {
    it('maintains reactivity when pathfinders are updated', async () => {
      const initialPathfinder = createMockPathfinder({ pathfinderID: '1' })
      store.pathfinders = [initialPathfinder]

      const updatedPathfinder = { ...initialPathfinder, firstName: 'Updated' }
      store.pathfinders[0] = updatedPathfinder

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(store.pathfinders[0].firstName).toBe('Updated')
    })

    it('getters update when underlying state changes', () => {
      store.pathfinders = [createMockPathfinder({ grade: 5 })]
      expect(store.getPathfindersByGrade(5)).toHaveLength(1)
      
      store.pathfinders.push(createMockPathfinder({ grade: 5 }))
      expect(store.getPathfindersByGrade(5)).toHaveLength(2)
    })
  })
}) 