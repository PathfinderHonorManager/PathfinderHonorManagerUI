import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EditPathfinderComponent from '../EditPathfinderComponent.vue'

const updatePathfinder = vi.fn()

vi.mock('@/stores/pathfinders', () => ({
  usePathfinderStore: () => ({
    updatePathfinder
  })
}))

describe('EditPathfinderComponent', () => {
  const pathfinder = {
    pathfinderID: 'pf-1',
    grade: 6,
    isActive: true
  }

  beforeEach(() => {
    updatePathfinder.mockReset()
  })

  it('shows grade error and blocks submit for invalid grade', async () => {
    const wrapper = mount(EditPathfinderComponent, {
      props: { pathfinder }
    })

    wrapper.vm.formPathfinder.grade = 4
    await wrapper.find('form').trigger('submit.prevent')

    expect(updatePathfinder).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Grade must be between 5 and 12')
  })

  it('emits edit-success on update', async () => {
    updatePathfinder.mockResolvedValue(undefined)

    const wrapper = mount(EditPathfinderComponent, {
      props: { pathfinder }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(updatePathfinder).toHaveBeenCalledWith('pf-1', {
      grade: 6,
      isActive: true
    })
    expect(wrapper.emitted('edit-success')).toBeTruthy()
  })

  it('emits edit-failure on error', async () => {
    updatePathfinder.mockRejectedValue(new Error('Update failed'))

    const wrapper = mount(EditPathfinderComponent, {
      props: { pathfinder }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('edit-failure')?.[0]).toEqual(['Update failed'])
  })
})
