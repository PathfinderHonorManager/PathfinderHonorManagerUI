import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HonorsDisplayComponent from '../HonorsDisplayComponent.vue'
import { createPinia, setActivePinia } from 'pinia'

const mockHonors = [
  { honorID: '1', name: 'Honor 1', patchFilename: 'honor1.png' },
  { honorID: '2', name: 'Honor 2', patchFilename: 'honor2.png' }
]

describe('HonorsDisplayComponent', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders nothing if honorSearchResult is empty', () => {
    const wrapper = mount(HonorsDisplayComponent, {
      props: {
        honorSearchResult: [],
        selectionType: 'plan'
      },
      global: { plugins: [createPinia()] }
    })
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('renders honors when honorSearchResult is provided', () => {
    const wrapper = mount(HonorsDisplayComponent, {
      props: {
        honorSearchResult: mockHonors,
        selectionType: 'plan'
      },
      global: { plugins: [createPinia()] }
    })
    expect(wrapper.findAll('.honor-item')).toHaveLength(2)
    expect(wrapper.text()).toContain('Honor 1')
    expect(wrapper.text()).toContain('Honor 2')
  })

  it('uses default value for selectionType if not provided', () => {
    const wrapper = mount(HonorsDisplayComponent, {
      props: {
        honorSearchResult: mockHonors
      },
      global: { plugins: [createPinia()] }
    })
    expect(wrapper.props('selectionType')).toBe('plan')
  })

  it('uses default value for honorSearchResult if not provided', () => {
    const wrapper = mount(HonorsDisplayComponent, {
      props: {
        selectionType: 'plan'
      },
      global: { plugins: [createPinia()] }
    })
    expect(wrapper.props('honorSearchResult')).toEqual([])
  })

  it('emits toggle-selection when honor is clicked', async () => {
    const wrapper = mount(HonorsDisplayComponent, {
      props: {
        honorSearchResult: mockHonors,
        selectionType: 'plan'
      },
      global: { plugins: [createPinia()] }
    })
    const honorItems = wrapper.findAll('.honor-item')
    expect(honorItems.length).toBeGreaterThan(0)
    await honorItems[0]!.trigger('click')
    expect(wrapper.emitted('toggle-selection')).toBeTruthy()
    expect(wrapper.emitted('toggle-selection')[0][0]).toBe('1')
  })
}) 