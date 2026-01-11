import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { addOrUpdateSelectedToClub } from '@/utils/manageHonors'

describe('addOrUpdateSelectedToClub', () => {
  it('clears selections and sets bulkAdd when updates succeed', async () => {
    const pathfinderStore = {
      bulkManagePathfinderHonors: vi.fn().mockResolvedValue({
        successful: [{ pathfinderHonorID: '1' }],
        failed: []
      })
    }
    const honorStore = {}
    const selectionStore = {
      clearSelection: vi.fn()
    }
    const recipients = ref([{ pathfinderID: 'pf-1' }])
    const selectedHonors = ref([{ honorID: 'honor-1' }])
    const bulkAdd = ref(false)

    await addOrUpdateSelectedToClub(
      pathfinderStore as typeof pathfinderStore,
      honorStore as typeof honorStore,
      selectionStore as typeof selectionStore,
      recipients,
      selectedHonors,
      'plan',
      bulkAdd
    )

    expect(pathfinderStore.bulkManagePathfinderHonors).toHaveBeenCalled()
    expect(selectionStore.clearSelection).toHaveBeenCalledWith('plan')
    expect(recipients.value).toEqual([])
    expect(selectedHonors.value).toEqual([])
    expect(bulkAdd.value).toBe(true)
  })

  it('leaves selections intact when there are no successful updates', async () => {
    const pathfinderStore = {
      bulkManagePathfinderHonors: vi.fn().mockResolvedValue({
        successful: [],
        failed: ['failed']
      })
    }
    const honorStore = {}
    const selectionStore = {
      clearSelection: vi.fn()
    }
    const recipients = ref([{ pathfinderID: 'pf-1' }])
    const selectedHonors = ref([{ honorID: 'honor-1' }])
    const bulkAdd = ref(false)

    await addOrUpdateSelectedToClub(
      pathfinderStore as typeof pathfinderStore,
      honorStore as typeof honorStore,
      selectionStore as typeof selectionStore,
      recipients,
      selectedHonors,
      'earn',
      bulkAdd
    )

    expect(selectionStore.clearSelection).not.toHaveBeenCalled()
    expect(recipients.value).toEqual([{ pathfinderID: 'pf-1' }])
    expect(selectedHonors.value).toEqual([{ honorID: 'honor-1' }])
    expect(bulkAdd.value).toBe(false)
  })
})
