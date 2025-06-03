import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import PathfinderComponent from "@/components/PathfinderComponent.vue";
import { ValidationError } from "@/models/pathfinder";

const mockPathfinderStore = {
  pathfinders: [],
  loading: false,
  error: false,
  postPathfinder: vi.fn(),
  getPathfinders: vi.fn()
};

const mockUserStore = {
  permissions: ["create:pathfinders", "update:pathfinders"]
};

const mockHonorStore = {
  honors: [],
  getHonors: vi.fn()
};

vi.mock("@/stores/pathfinders", () => ({
  usePathfinderStore: () => mockPathfinderStore
}));

vi.mock("@/stores/users", () => ({
  useUserStore: () => mockUserStore
}));

vi.mock("@/stores/honors", () => ({
  useHonorStore: () => mockHonorStore
}));

describe("PathfinderComponent", () => {
  let wrapper;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    
    vi.clearAllMocks();
    
    wrapper = shallowMount(PathfinderComponent, {
      global: {
        plugins: [pinia],
        stubs: {
          PathfinderList: true,
          ModalComponent: true,
          EditPathfinderComponent: true,
          ToasterComponent: true,
          CreatePathfinderForm: true
        }
      }
    });
  });

  describe("submitAddForm", () => {
    it("should show success toast and close modal on successful submission", async () => {
      mockPathfinderStore.postPathfinder.mockResolvedValue(undefined);

      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        grade: 8
      };

      await wrapper.vm.submitAddForm(formData);
      await wrapper.vm.$nextTick();

      expect(mockPathfinderStore.postPathfinder).toHaveBeenCalledWith(formData);
      expect(wrapper.vm.creatingPathfinder).toBe(false);
      expect(wrapper.vm.showToaster).toBe(true);
      expect(wrapper.vm.toasterMessage).toBe("Successfully created pathfinder John Doe");
    });

    it("should show error toast and keep modal open on failed submission", async () => {
      const error = new Error("API Error");
      mockPathfinderStore.postPathfinder.mockRejectedValue(error);

      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "",
        grade: 8
      };

      wrapper.vm.creatingPathfinder = true;
      await wrapper.vm.submitAddForm(formData);
      await wrapper.vm.$nextTick();

      expect(mockPathfinderStore.postPathfinder).toHaveBeenCalledWith(formData);
      expect(wrapper.vm.creatingPathfinder).toBe(true);
      expect(wrapper.vm.showToaster).toBe(true);
      expect(wrapper.vm.toasterMessage).toBe("Failed to create pathfinder: API Error");
    });

    it("should call setServerErrors and not show toast for validation errors", async () => {
      const validationError = new ValidationError({
        Email: ["'Email' is not a valid email address."]
      });
      mockPathfinderStore.postPathfinder.mockRejectedValue(validationError);
      const mockSetServerErrors = vi.fn();
      wrapper.vm.createFormRef = { setServerErrors: mockSetServerErrors };

      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        grade: 8
      };

      wrapper.vm.creatingPathfinder = true;
      await wrapper.vm.submitAddForm(formData);
      await wrapper.vm.$nextTick();

      expect(mockPathfinderStore.postPathfinder).toHaveBeenCalledWith(formData);
      expect(wrapper.vm.creatingPathfinder).toBe(true);
      expect(mockSetServerErrors).toHaveBeenCalledWith({
        Email: ["'Email' is not a valid email address."]
      });
      expect(wrapper.vm.showToaster).toBe(false);
    });

    it("should call clearForm on successful submission", async () => {
      mockPathfinderStore.postPathfinder.mockResolvedValue(undefined);
      const mockClearForm = vi.fn();
      wrapper.vm.createFormRef = { clearForm: mockClearForm };

      const formData = {
        firstName: "John", 
        lastName: "Doe",
        email: "john@example.com",
        grade: 8
      };

      await wrapper.vm.submitAddForm(formData);

      expect(mockClearForm).toHaveBeenCalled();
    });

    it("should not call clearForm on failed submission", async () => {
      const error = new Error("API Error");
      mockPathfinderStore.postPathfinder.mockRejectedValue(error);
      const mockClearForm = vi.fn();
      wrapper.vm.createFormRef = { clearForm: mockClearForm };

      const formData = {
        firstName: "John",
        lastName: "Doe", 
        email: "john@example.com",
        grade: 8
      };

      await wrapper.vm.submitAddForm(formData);

      expect(mockClearForm).not.toHaveBeenCalled();
    });
  });
}); 