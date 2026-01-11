import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSelectionStore } from '@/stores/selectionStore'
import { expectStoreState } from '@/utils/test-helpers'

describe('Selection Store', () => {
  let store: ReturnType<typeof useSelectionStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useSelectionStore()
  })

  describe('Initial State', () => {
    it('has correct initial state structure', () => {
      expectStoreState(store, {
        selections: {
          plan: {
            pathfinders: [],
            honors: []
          },
          earn: {
            pathfinders: [],
            honors: []
          },
          award: {
            pathfinders: [],
            honors: []
          },
          investiture: {
            pathfinders: [],
            honors: []
          },
          achievements: {
            pathfinders: [],
            honors: [],
            achievements: []
          }
        }
      })
    })

    it('initializes all selection types with empty arrays', () => {
      const selectionTypes = ['plan', 'earn', 'award', 'investiture', 'achievements'] as const
      const standardCategories = ['pathfinders', 'honors'] as const

      // Test standard selection types
      selectionTypes.slice(0, 4).forEach(type => {
        standardCategories.forEach(category => {
          expect(store.selections[type][category]).toEqual([])
        })
      })

      // Test achievements selection type (has additional achievements category)
      expect(store.selections.achievements.pathfinders).toEqual([])
      expect(store.selections.achievements.honors).toEqual([])
      expect(store.selections.achievements.achievements).toEqual([])
    })
  })

  describe('Actions - toggleSelection', () => {
    it('adds item when not present', () => {
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      
      expect(store.selections.plan.pathfinders).toContain('pathfinder-1')
      expect(store.selections.plan.pathfinders).toHaveLength(1)
    })

    it('removes item when already present', () => {
      store.selections.plan.pathfinders.push('pathfinder-1')
      
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      
      expect(store.selections.plan.pathfinders).not.toContain('pathfinder-1')
      expect(store.selections.plan.pathfinders).toHaveLength(0)
    })

    it('works with honors category', () => {
      store.toggleSelection('earn', 'honor-1', 'honors')
      
      expect(store.selections.earn.honors).toContain('honor-1')
      expect(store.selections.earn.honors).toHaveLength(1)
    })

    it('works with all selection types', () => {
      const types = ['plan', 'earn', 'award', 'investiture'] as const
      
      types.forEach(type => {
        store.toggleSelection(type, `${type}-item`, 'pathfinders')
        expect(store.selections[type].pathfinders).toContain(`${type}-item`)
      })
    })

    it('handles multiple items in same category', () => {
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      store.toggleSelection('plan', 'pathfinder-2', 'pathfinders')
      store.toggleSelection('plan', 'pathfinder-3', 'pathfinders')
      
      expect(store.selections.plan.pathfinders).toEqual(['pathfinder-1', 'pathfinder-2', 'pathfinder-3'])
    })

    it('handles toggle off from middle of array', () => {
      store.selections.plan.pathfinders = ['item-1', 'item-2', 'item-3']
      
      store.toggleSelection('plan', 'item-2', 'pathfinders')
      
      expect(store.selections.plan.pathfinders).toEqual(['item-1', 'item-3'])
    })

    it('does not affect other selection types', () => {
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      
      expect(store.selections.earn.pathfinders).toEqual([])
      expect(store.selections.award.pathfinders).toEqual([])
      expect(store.selections.investiture.pathfinders).toEqual([])
    })

    it('does not affect other categories', () => {
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      
      expect(store.selections.plan.honors).toEqual([])
    })

    it('toggles achievements selection in achievements category', () => {
      store.toggleSelection('achievements', 'achievement-1', 'achievements')
      expect(store.selections.achievements.achievements).toEqual(['achievement-1'])

      store.toggleSelection('achievements', 'achievement-1', 'achievements')
      expect(store.selections.achievements.achievements).toEqual([])
    })
  })

  describe('Actions - clearSelection', () => {
    beforeEach(() => {
      store.selections.plan.pathfinders = ['pathfinder-1', 'pathfinder-2']
      store.selections.plan.honors = ['honor-1', 'honor-2']
      store.selections.earn.pathfinders = ['pathfinder-3']
      store.selections.earn.honors = ['honor-3']
    })

    it('clears both categories for specified selection type', () => {
      store.clearSelection('plan')
      
      expect(store.selections.plan.pathfinders).toEqual([])
      expect(store.selections.plan.honors).toEqual([])
    })

    it('does not affect other selection types', () => {
      store.clearSelection('plan')
      
      expect(store.selections.earn.pathfinders).toEqual(['pathfinder-3'])
      expect(store.selections.earn.honors).toEqual(['honor-3'])
    })

    it('works with all selection types', () => {
      const types = ['plan', 'earn', 'award', 'investiture'] as const
      
      types.forEach(type => {
        store.selections[type].pathfinders = ['test-item']
        store.selections[type].honors = ['test-honor']
        
        store.clearSelection(type)
        
        expect(store.selections[type].pathfinders).toEqual([])
        expect(store.selections[type].honors).toEqual([])
      })
    })

    it('handles clearing empty selections gracefully', () => {
      store.clearSelection('award')
      
      expect(store.selections.award.pathfinders).toEqual([])
      expect(store.selections.award.honors).toEqual([])
    })

    it('clears achievements selection when type is achievements', () => {
      store.selections.achievements.pathfinders = ['pf-1']
      store.selections.achievements.honors = ['honor-1']
      store.selections.achievements.achievements = ['achievement-1']

      store.clearSelection('achievements')

      expect(store.selections.achievements.pathfinders).toEqual([])
      expect(store.selections.achievements.honors).toEqual([])
      expect(store.selections.achievements.achievements).toEqual([])
    })
  })

  describe('Actions - isSelected', () => {
    beforeEach(() => {
      store.selections.plan.pathfinders = ['pathfinder-1', 'pathfinder-2']
      store.selections.plan.honors = ['honor-1']
      store.selections.earn.pathfinders = ['pathfinder-3']
    })

    it('returns true for selected pathfinder', () => {
      expect(store.isSelected('plan', 'pathfinder-1', 'pathfinders')).toBe(true)
      expect(store.isSelected('plan', 'pathfinder-2', 'pathfinders')).toBe(true)
    })

    it('returns false for non-selected pathfinder', () => {
      expect(store.isSelected('plan', 'pathfinder-3', 'pathfinders')).toBe(false)
      expect(store.isSelected('plan', 'nonexistent', 'pathfinders')).toBe(false)
    })

    it('returns true for selected honor', () => {
      expect(store.isSelected('plan', 'honor-1', 'honors')).toBe(true)
    })

    it('returns false for non-selected honor', () => {
      expect(store.isSelected('plan', 'honor-2', 'honors')).toBe(false)
    })

    it('works across different selection types', () => {
      expect(store.isSelected('earn', 'pathfinder-3', 'pathfinders')).toBe(true)
      expect(store.isSelected('plan', 'pathfinder-3', 'pathfinders')).toBe(false)
    })

    it('handles empty selections', () => {
      expect(store.isSelected('award', 'any-id', 'pathfinders')).toBe(false)
      expect(store.isSelected('investiture', 'any-id', 'honors')).toBe(false)
    })

    it('returns selection status for achievements category', () => {
      store.selections.achievements.achievements = ['achievement-1']

      expect(store.isSelected('achievements', 'achievement-1', 'achievements')).toBe(true)
      expect(store.isSelected('achievements', 'achievement-2', 'achievements')).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('handles duplicate toggle attempts gracefully', () => {
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      
      expect(store.selections.plan.pathfinders).toContain('pathfinder-1')
      expect(store.selections.plan.pathfinders).toHaveLength(1)
    })

    it('handles empty string IDs', () => {
      store.toggleSelection('plan', '', 'pathfinders')
      
      expect(store.selections.plan.pathfinders).toContain('')
    })

    it('handles special character IDs', () => {
      const specialId = 'id-with-special@chars#123'
      
      store.toggleSelection('plan', specialId, 'pathfinders')
      
      expect(store.isSelected('plan', specialId, 'pathfinders')).toBe(true)
    })

    it('maintains separate arrays for different categories', () => {
      const sameId = 'same-id'
      
      store.toggleSelection('plan', sameId, 'pathfinders')
      store.toggleSelection('plan', sameId, 'honors')
      
      expect(store.selections.plan.pathfinders).toContain(sameId)
      expect(store.selections.plan.honors).toContain(sameId)
      expect(store.selections.plan.pathfinders).toHaveLength(1)
      expect(store.selections.plan.honors).toHaveLength(1)
    })
  })

  describe('State Reactivity', () => {
    it('maintains reactivity when selections change', async () => {
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(store.isSelected('plan', 'pathfinder-1', 'pathfinders')).toBe(true)
    })

    it('maintains state consistency across operations', () => {
      const pathfinderIds = ['p1', 'p2', 'p3', 'p4', 'p5']
      const honorIds = ['h1', 'h2', 'h3']
      
      pathfinderIds.forEach(id => store.toggleSelection('plan', id, 'pathfinders'))
      honorIds.forEach(id => store.toggleSelection('plan', id, 'honors'))
      
      expect(store.selections.plan.pathfinders).toHaveLength(5)
      expect(store.selections.plan.honors).toHaveLength(3)
      
      store.clearSelection('plan')
      
      expect(store.selections.plan.pathfinders).toHaveLength(0)
      expect(store.selections.plan.honors).toHaveLength(0)
    })

    it('preserves order of selection', () => {
      const ids = ['first', 'second', 'third']
      
      ids.forEach(id => store.toggleSelection('plan', id, 'pathfinders'))
      
      expect(store.selections.plan.pathfinders).toEqual(ids)
    })
  })

  describe('Performance', () => {
    it('handles large number of selections efficiently', () => {
      const start = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        store.toggleSelection('plan', `pathfinder-${i}`, 'pathfinders')
      }
      
      const end = performance.now()
      
      expect(store.selections.plan.pathfinders).toHaveLength(1000)
      expect(end - start).toBeLessThan(200) // Should be reasonably fast
    })

    it('searches efficiently in large arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => `item-${i}`)
      store.selections.plan.pathfinders = [...largeArray]
      
      const start = performance.now()
      const isSelected = store.isSelected('plan', 'item-500', 'pathfinders')
      const end = performance.now()
      
      expect(isSelected).toBe(true)
      expect(end - start).toBeLessThan(10) // Should be very fast
    })
  })

  describe('Integration Scenarios', () => {
    it('supports complex selection workflows', () => {
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      store.toggleSelection('plan', 'pathfinder-2', 'pathfinders')
      store.toggleSelection('plan', 'honor-1', 'honors')
      
      expect(store.selections.plan.pathfinders).toHaveLength(2)
      expect(store.selections.plan.honors).toHaveLength(1)
      
      store.toggleSelection('plan', 'pathfinder-1', 'pathfinders')
      
      expect(store.selections.plan.pathfinders).toHaveLength(1)
      expect(store.selections.plan.pathfinders).toEqual(['pathfinder-2'])
      expect(store.selections.plan.honors).toHaveLength(1)
    })

    it('supports batch operations across selection types', () => {
      const types = ['plan', 'earn', 'award'] as const
      
      types.forEach(type => {
        store.toggleSelection(type, 'shared-pathfinder', 'pathfinders')
        store.toggleSelection(type, 'shared-honor', 'honors')
      })
      
      types.forEach(type => {
        expect(store.isSelected(type, 'shared-pathfinder', 'pathfinders')).toBe(true)
        expect(store.isSelected(type, 'shared-honor', 'honors')).toBe(true)
      })
      
      store.clearSelection('plan')
      
      expect(store.isSelected('plan', 'shared-pathfinder', 'pathfinders')).toBe(false)
      expect(store.isSelected('earn', 'shared-pathfinder', 'pathfinders')).toBe(true)
      expect(store.isSelected('award', 'shared-pathfinder', 'pathfinders')).toBe(true)
    })
  })
}) 
