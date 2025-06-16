import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DropDownButtonComponent from '../DropDownButtonComponent.vue'

describe('DropDownButtonComponent', () => {
  describe('Props and Default Values', () => {
    it('renders with required options prop', () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2']
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('uses default text when defaultText prop is not provided', () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2']
        }
      })
      expect(wrapper.find('#title').text()).toBe('Select an option')
    })

    it('uses provided defaultText prop', () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2'],
          defaultText: 'Custom Default'
        }
      })
      expect(wrapper.find('#title').text()).toBe('Custom Default')
    })
  })

  describe('Dropdown Functionality', () => {
    it('expands dropdown when clicked', async () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2']
        }
      })
      
      await wrapper.find('#title').trigger('click')
      expect(wrapper.find('#options').exists()).toBe(true)
    })

    it('shows all options when expanded', async () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2', 'Option 3']
        }
      })
      
      await wrapper.find('#title').trigger('click')
      const options = wrapper.findAll('#options button')
      expect(options).toHaveLength(3)
      expect(options[0].text()).toBe('Option 1')
      expect(options[1].text()).toBe('Option 2')
      expect(options[2].text()).toBe('Option 3')
    })

    it('collapses dropdown when option is selected', async () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2']
        }
      })
      
      await wrapper.find('#title').trigger('click')
      await wrapper.find('#options button').trigger('click')
      expect(wrapper.find('#options').exists()).toBe(false)
    })

    it('updates selected text when option is chosen', async () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2']
        }
      })
      
      await wrapper.find('#title').trigger('click')
      await wrapper.find('#options button').trigger('click')
      expect(wrapper.find('#title').text()).toBe('Option 1')
    })
  })

  describe('Styling', () => {
    it('applies last class to last option', async () => {
      const wrapper = mount(DropDownButtonComponent, {
        props: {
          options: ['Option 1', 'Option 2']
        }
      })
      
      await wrapper.find('#title').trigger('click')
      const options = wrapper.findAll('#options button')
      expect(options[1].classes()).toContain('last')
    })
  })
}) 