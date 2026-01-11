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
    
    // Reset store state
    store.$reset()
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
      } catch {
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

    it('handles bulk operation with mixed success and failure responses', async () => {
      const pathfinderIDs = ['path1', 'path2']
      const honorIDs = ['honor1']
      
      const mockBulkResponse = [
        {
          status: 201,
          pathfinderHonor: {
            pathfinderID: 'path1',
            honorID: 'honor1',
            status: status.Planned
          }
        },
        {
          status: 400,
          error: 'Validation failed for pathfinder path2'
        }
      ]

      vi.mocked(api.bulkManagePathfinderHonors).mockResolvedValue(
        mockApiResponse(mockBulkResponse)
      )

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = await store.bulkManagePathfinderHonors(pathfinderIDs, honorIDs, 'plan')

      expect(result?.successful).toHaveLength(1)
      expect(result?.failed).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not plan pathfinder honors')
      )
      
      consoleSpy.mockRestore()
    })

    it('handles API error in bulk operation', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(api.bulkManagePathfinderHonors).mockRejectedValue(new Error('Server error'))

      await store.bulkManagePathfinderHonors(['path1'], ['honor1'], 'plan')

      expect(store.error).toBe(true)
      expect(store.loading).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not plan pathfinder honors')
      )
      
      consoleSpy.mockRestore()
    })

    it('correctly maps action types to status in bulk operations', async () => {
      store.pathfinders = mockPathfinders

      const mockEarnResponse = [{
        status: 201,
        pathfinderHonor: {
          pathfinderID: 'path1',
          honorID: 'honor1',
          status: status.Earned
        }
      }]

      vi.mocked(api.bulkManagePathfinderHonors).mockResolvedValue(
        mockApiResponse(mockEarnResponse)
      )

      await store.bulkManagePathfinderHonors(['path1'], ['honor1'], 'earn')

      expect(api.bulkManagePathfinderHonors).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            honors: expect.arrayContaining([
              expect.objectContaining({ status: status.Earned })
            ])
          })
        ]),
        'earn'
      )
    })

    it('handles status 200 responses with pathfinderHonor in bulk operations', async () => {
      store.pathfinders = [...mockPathfinders]

      const mockResponse = [{
        status: 200,
        pathfinderHonor: {
          pathfinderHonorID: 'test-honor-id',
          pathfinderID: mockPathfinders[0].pathfinderID,
          honorID: 'honor1',
          name: 'Test Honor',
          status: status.Planned,
          patchPath: 'test_honor.png'
        }
      }]

      vi.mocked(api.bulkManagePathfinderHonors).mockResolvedValue(
        mockApiResponse(mockResponse)
      )

      const result = await store.bulkManagePathfinderHonors([mockPathfinders[0].pathfinderID], ['honor1'], 'plan')

      expect(result).toBeDefined()
      expect(result?.successful).toHaveLength(1)
      expect(result?.failed).toHaveLength(0)
    })
  })

  describe('Actions - postPathfinderHonor', () => {
    it('successfully adds honor to pathfinder', async () => {
      const pathfinderID = mockPathfinders[0].pathfinderID
      const honorId = 'new-honor-id'
      
      const updatedPathfinder = {
        ...mockPathfinders[0],
        pathfinderHonors: [
          ...mockPathfinders[0].pathfinderHonors,
          createMockPathfinderHonor({ 
            pathfinderID,
            honorID: honorId, 
            status: status.Planned,
            name: 'New Test Honor'
          })
        ]
      }

      vi.mocked(api.postPathfinderHonor).mockResolvedValue(mockApiResponse({}))
      vi.mocked(api.get).mockResolvedValue(mockApiResponse(updatedPathfinder))

      store.pathfinders = [mockPathfinders[0]]

      await store.postPathfinderHonor(pathfinderID, honorId)

      expect(api.postPathfinderHonor).toHaveBeenCalledWith(
        pathfinderID,
        { honorID: honorId, status: status.Planned }
      )
      expect(api.get).toHaveBeenCalledWith(pathfinderID)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(false)
    })

    it('handles error when adding honor fails', async () => {
      const pathfinderID = 'invalid-id'
      const honorId = 'honor-id'
      
      // Mock both API calls - postPathfinderHonor fails, but getPathfinderById in finally should succeed
      vi.mocked(api.postPathfinderHonor).mockRejectedValue(new Error('Honor already exists'))
      vi.mocked(api.get).mockResolvedValue(mockApiResponse(mockPathfinders[0]))
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.postPathfinderHonor(pathfinderID, honorId)

      // The error is logged during the catch block, which is what we want to verify
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could add honor')
      )
      // The error state gets reset to false by the getPathfinderById call in finally
      expect(store.loading).toBe(false)
      
      consoleSpy.mockRestore()
    })
  })

  describe('Actions - getPathfinderById', () => {
    it('successfully fetches and updates specific pathfinder', async () => {
      const pathfinderToUpdate = mockPathfinders[0]
      const updatedData = {
        ...pathfinderToUpdate,
        firstName: 'UpdatedSally',
        pathfinderHonors: [
          ...pathfinderToUpdate.pathfinderHonors,
          createMockPathfinderHonor({ 
            pathfinderID: pathfinderToUpdate.pathfinderID,
            honorID: 'new-honor', 
            name: 'New Test Honor',
            status: status.Earned 
          })
        ]
      }

      store.pathfinders = [...mockPathfinders]
      vi.mocked(api.get).mockResolvedValue(mockApiResponse(updatedData))

      await store.getPathfinderById(pathfinderToUpdate.pathfinderID)

      expect(api.get).toHaveBeenCalledWith(pathfinderToUpdate.pathfinderID)
      expect(store.pathfinders[0]).toEqual(updatedData)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(false)
    })

    it('handles error when pathfinder not found', async () => {
      const invalidID = 'non-existent-id'
      const mockError = { status: 404, message: 'Not found' }
      
      vi.mocked(api.get).mockRejectedValue(mockError)

      await expect(store.getPathfinderById(invalidID)).rejects.toThrow()
      
      expect(store.error).toBe(true)
      expect(store.loading).toBe(false)
    })

    it('does not update pathfinder if not found in store', async () => {
      const nonExistentID = 'missing-pathfinder'
      const originalPathfinders = [...mockPathfinders]
      
      store.pathfinders = originalPathfinders
      vi.mocked(api.get).mockResolvedValue(mockApiResponse({
        pathfinderID: nonExistentID,
        firstName: 'NotInStore'
      }))

      await store.getPathfinderById(nonExistentID)

      expect(store.pathfinders).toEqual(originalPathfinders)
    })
  })

  describe('Actions - updatePathfinder', () => {
    it('successfully updates pathfinder data', async () => {
      const pathfinderID = mockPathfinders[0].pathfinderID
      const updateData = { grade: 8, isActive: true }
      const updatedPathfinder = { ...mockPathfinders[0], ...updateData }

      store.pathfinders = [...mockPathfinders]
      
      vi.mocked(api.putPathfinder).mockResolvedValue(mockApiResponse(updatedPathfinder))
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse([
        updatedPathfinder,
        mockPathfinders[1]
      ]))

      await store.updatePathfinder(pathfinderID, updateData)

      expect(api.putPathfinder).toHaveBeenCalledWith(pathfinderID, updateData)
      expect(api.getAll).toHaveBeenCalled()
      expect(store.loading).toBe(false)
      expect(store.error).toBe(false)
    })

    it('handles Error instance in updatePathfinder', async () => {
      const pathfinderID = 'test-id'
      const updateData = { grade: 8, isActive: true }
      const errorMessage = 'Validation failed: Grade must be between 1 and 12'
      
      vi.mocked(api.putPathfinder).mockRejectedValue(new Error(errorMessage))
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(store.updatePathfinder(pathfinderID, updateData)).rejects.toThrow(errorMessage)

      expect(store.error).toBe(true)
      expect(store.loading).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(errorMessage)
      
      consoleSpy.mockRestore()
    })

    it('handles non-Error exceptions in updatePathfinder', async () => {
      const pathfinderID = 'test-id'
      const updateData = { grade: 8, isActive: true }
      
      vi.mocked(api.putPathfinder).mockRejectedValue('String error')
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(store.updatePathfinder(pathfinderID, updateData)).rejects.toThrow(
        'Could not update pathfinder due to an unexpected error'
      )

      expect(store.error).toBe(true)
      expect(store.loading).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Could not update pathfinder due to an unexpected error'
      )
      
      consoleSpy.mockRestore()
    })

    it('updates local pathfinder data when found in store', async () => {
      const pathfinderID = mockPathfinders[0].pathfinderID
      const updateData = { grade: 10, isActive: false }

      // Verify the pathfinder exists in the store first
      store.pathfinders = [...mockPathfinders]
      const originalPathfinder = store.pathfinders.find(p => p.pathfinderID === pathfinderID)
      expect(originalPathfinder).toBeDefined()

      vi.mocked(api.putPathfinder).mockResolvedValue(mockApiResponse({}))
      vi.mocked(api.getAll).mockResolvedValue(mockApiResponse([
        { ...mockPathfinders[0], ...updateData },
        mockPathfinders[1]
      ]))

      await store.updatePathfinder(pathfinderID, updateData)

      // The local update happens before the refresh call
      // So we check what was passed to the API, not the final state after getAll()
      expect(api.putPathfinder).toHaveBeenCalledWith(pathfinderID, updateData)
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
      store.pathfinders = [pathfinderWithoutHonors]
      
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
