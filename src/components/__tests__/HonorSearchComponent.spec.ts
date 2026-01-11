import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HonorSearchComponent from '../HonorSearchComponent.vue'

const getHonorsByQuery = vi.fn()

vi.mock('@/stores/honors', () => ({
  useHonorStore: () => ({
    getHonorsByQuery
  })
}))

describe('HonorSearchComponent', () => {
  beforeEach(() => {
    getHonorsByQuery.mockReset()
  })

  it('emits search results when query is entered', async () => {
    getHonorsByQuery.mockReturnValue([{ honorID: '1', name: 'Honor One' }])

    const wrapper = mount(HonorSearchComponent)
    const input = wrapper.find('input')

    await input.setValue('Honor')

    const emitted = wrapper.emitted('search-result')
    expect(emitted?.[0][0]).toEqual([{ honorID: '1', name: 'Honor One' }])
  })

  it('emits empty results when query is cleared', async () => {
    getHonorsByQuery.mockReturnValue([{ honorID: '1', name: 'Honor One' }])

    const wrapper = mount(HonorSearchComponent)
    const input = wrapper.find('input')

    await input.setValue('Honor')
    await input.setValue('')

    const emitted = wrapper.emitted('search-result')
    expect(emitted?.at(-1)?.[0]).toEqual([])
  })
})
