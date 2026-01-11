import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ClubView from '../ClubView.vue'

const mockUserStore = {
  clubName: '',
  isLoadingClub: false
}

vi.mock('@/stores/users', () => ({
  useUserStore: () => mockUserStore
}))

describe('ClubView', () => {
  it('shows loading state while club is loading', () => {
    mockUserStore.isLoadingClub = true
    mockUserStore.clubName = ''

    const wrapper = mount(ClubView, {
      global: {
        stubs: {
          PathfinderComponent: true
        }
      }
    })

    expect(wrapper.find('h1').text()).toBe('Loading Club...')
  })

  it('shows club name when available', () => {
    mockUserStore.isLoadingClub = false
    mockUserStore.clubName = 'North'

    const wrapper = mount(ClubView, {
      global: {
        stubs: {
          PathfinderComponent: true
        }
      }
    })

    expect(wrapper.find('h1').text()).toBe('North Club')
  })

  it('falls back to generic club header when name is missing', () => {
    mockUserStore.isLoadingClub = false
    mockUserStore.clubName = ''

    const wrapper = mount(ClubView, {
      global: {
        stubs: {
          PathfinderComponent: true
        }
      }
    })

    expect(wrapper.find('h1').text()).toBe('Club')
  })
})
