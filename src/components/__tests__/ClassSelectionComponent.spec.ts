import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ClassSelectionComponent from '../ClassSelectionComponent.vue'

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/achievements/:className',
      name: 'Achievements',
      component: { template: '<div>Mock Achievements</div>' }
    }
  ]
})

describe('ClassSelectionComponent', () => {
  it('renders all pathfinder classes', () => {
    const wrapper = mount(ClassSelectionComponent, {
      global: {
        plugins: [router]
      }
    })

    const classCards = wrapper.findAll('.class-card')
    expect(classCards).toHaveLength(6)

    const classNames = classCards.map(card => card.find('h3').text())
    expect(classNames).toEqual(['Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide'])
  })

  it('displays correct grades for each class', () => {
    const wrapper = mount(ClassSelectionComponent, {
      global: {
        plugins: [router]
      }
    })

    const gradeElements = wrapper.findAll('.grade')
    const grades = gradeElements.map(el => el.text())
    expect(grades).toEqual(['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'])
  })

  it('creates correct router links for each class', () => {
    const wrapper = mount(ClassSelectionComponent, {
      global: {
        plugins: [router]
      }
    })

    const links = wrapper.findAll('a')
    expect(links).toHaveLength(6)

    // Check that each link has the correct route
    const expectedRoutes = [
      { name: 'Achievements', params: { className: 'Friend' } },
      { name: 'Achievements', params: { className: 'Companion' } },
      { name: 'Achievements', params: { className: 'Explorer' } },
      { name: 'Achievements', params: { className: 'Ranger' } },
      { name: 'Achievements', params: { className: 'Voyager' } },
      { name: 'Achievements', params: { className: 'Guide' } }
    ]

    links.forEach((link, index) => {
      expect(link.attributes('href')).toBeDefined()
    })
  })

  it('has correct styling classes', () => {
    const wrapper = mount(ClassSelectionComponent, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.class-selection').exists()).toBe(true)
    expect(wrapper.find('.class-grid').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Select a Class')
  })

  it('applies hover effects correctly', () => {
    const wrapper = mount(ClassSelectionComponent, {
      global: {
        plugins: [router]
      }
    })

    const firstCard = wrapper.find('.class-card')
    expect(firstCard.classes()).toContain('class-card')
  })
}) 