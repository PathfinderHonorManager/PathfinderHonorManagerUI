import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import CreatePathfinderForm from "@/components/CreatePathfinderForm.vue";

describe("CreatePathfinderForm", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CreatePathfinderForm);
  });

  describe("Form validation", () => {
    it("should show error when first name is empty", async () => {
      const firstNameInput = wrapper.find('input[type="text"]').element;
      firstNameInput.value = '';
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.text()).toContain('First name is required');
    });

    it("should show error when last name is empty", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      inputs[0].element.value = 'John';
      inputs[1].element.value = '';
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.text()).toContain('Last name is required');
    });

    it("should show error for invalid email", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      await inputs[0].setValue('John');
      await inputs[1].setValue('Doe');
      await inputs[2].setValue('invalid-email');
      await inputs[3].setValue('8');
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.text()).toContain('Invalid email');
    });

    it("should show error for invalid grade", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      await inputs[0].setValue('John');
      await inputs[1].setValue('Doe');
      await inputs[2].setValue('john@example.com');
      await inputs[3].setValue('3');
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.text()).toContain('Grade must be between 5 and 12');
    });
  });

  describe("Form submission", () => {
    it("should emit submit event with correct data when form is valid", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      await inputs[0].setValue('John');
      await inputs[1].setValue('Doe');
      await inputs[2].setValue('john@example.com');
      await inputs[3].setValue('8');
      
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.emitted().submit).toBeTruthy();
      expect(wrapper.emitted().submit[0][0]).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        grade: 8
      });
    });

    it("should not emit submit event when form is invalid", async () => {
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.emitted().submit).toBeFalsy();
    });

    it("should emit submit event with null grade when grade is not provided", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      await inputs[0].setValue('John');
      await inputs[1].setValue('Doe');
      
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.emitted().submit).toBeTruthy();
      expect(wrapper.emitted().submit[0][0]).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: '',
        grade: null
      });
    });

    it("should emit submit event with empty email when email is not provided", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      await inputs[0].setValue('John');
      await inputs[1].setValue('Doe');
      await inputs[3].setValue('8');
      
      await wrapper.find('form').trigger('submit.prevent');
      
      expect(wrapper.emitted().submit).toBeTruthy();
      expect(wrapper.emitted().submit[0][0]).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: '',
        grade: 8
      });
    });
  });

  describe("clearForm method", () => {
    it("should clear all form fields and errors", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      await inputs[0].setValue('John');
      await inputs[1].setValue('Doe');
      await inputs[2].setValue('john@example.com');
      await inputs[3].setValue('8');
      
      // Trigger validation errors first
      await inputs[0].setValue('');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('First name is required');
      
      // Clear the form
      wrapper.vm.clearForm();
      await wrapper.vm.$nextTick();
      
      // Check that all fields are cleared
      expect(inputs[0].element.value).toBe('');
      expect(inputs[1].element.value).toBe('');
      expect(inputs[2].element.value).toBe('');
      expect(inputs[3].element.value).toBe('');
      
      // Check that error messages are cleared
      expect(wrapper.text()).not.toContain('First name is required');
    });
  });
}); 