import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, shallowMount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import PathfinderComponent from "@/components/PathfinderComponent.vue";
import { ValidationError } from "@/models/pathfinder";

const mockPathfinderStore = {
  pathfinders: [] as any[],
  loading: false,
  error: false,
  postPathfinder: vi.fn(),
  getPathfinders: vi.fn()
};

const mockUserStore = {
  permissions: ["create:pathfinders", "update:pathfinders"]
};

const mockHonorStore = {
  honors: [] as any[],
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
  let wrapper: VueWrapper<any>;

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

  describe("Data Loading", () => {
    it("should load pathfinders first when both stores are empty", async () => {
      // Clear mocks and set empty data
      vi.clearAllMocks();
      mockPathfinderStore.pathfinders = [];
      mockHonorStore.honors = [];
      
      // Create a new wrapper to trigger the loadData function
      const newWrapper = shallowMount(PathfinderComponent, {
        global: {
          plugins: [createPinia()],
          stubs: {
            PathfinderList: true,
            ModalComponent: true,
            EditPathfinderComponent: true,
            ToasterComponent: true,
            CreatePathfinderForm: true
          }
        }
      });

      // Wait for the next tick to allow loadData to execute
      await newWrapper.vm.$nextTick();
      
      // Pathfinders should be loaded first (synchronously)
      expect(mockPathfinderStore.getPathfinders).toHaveBeenCalled();
      
      // Honors should be loaded asynchronously (we can't easily test the async nature in this test)
      // but we can verify the function was called
      expect(mockHonorStore.getHonors).toHaveBeenCalled();
    });

    it("should not load pathfinders if they already exist", async () => {
      // Clear mocks and set existing pathfinder data
      vi.clearAllMocks();
      mockPathfinderStore.pathfinders = [{ pathfinderID: "1", firstName: "Test", lastName: "User" }];
      mockHonorStore.honors = [];
      
      const newWrapper = shallowMount(PathfinderComponent, {
        global: {
          plugins: [createPinia()],
          stubs: {
            PathfinderList: true,
            ModalComponent: true,
            EditPathfinderComponent: true,
            ToasterComponent: true,
            CreatePathfinderForm: true
          }
        }
      });

      await newWrapper.vm.$nextTick();
      
      // Pathfinders should not be loaded since they already exist
      expect(mockPathfinderStore.getPathfinders).not.toHaveBeenCalled();
      
      // Honors should still be loaded if they don't exist
      expect(mockHonorStore.getHonors).toHaveBeenCalled();
    });

    it("should not load honors if they already exist", async () => {
      // Clear mocks and set existing honor data
      vi.clearAllMocks();
      mockPathfinderStore.pathfinders = [];
      mockHonorStore.honors = [{ honorID: "1", name: "Test Honor" }];
      
      const newWrapper = shallowMount(PathfinderComponent, {
        global: {
          plugins: [createPinia()],
          stubs: {
            PathfinderList: true,
            ModalComponent: true,
            EditPathfinderComponent: true,
            ToasterComponent: true,
            CreatePathfinderForm: true
          }
        }
      });

      await newWrapper.vm.$nextTick();
      
      // Pathfinders should be loaded since they don't exist
      expect(mockPathfinderStore.getPathfinders).toHaveBeenCalled();
      
      // Honors should not be loaded since they already exist
      expect(mockHonorStore.getHonors).not.toHaveBeenCalled();
    });

    it("should handle errors in honors loading gracefully", async () => {
      // Clear mocks and set empty data
      vi.clearAllMocks();
      mockPathfinderStore.pathfinders = [];
      mockHonorStore.honors = [];
      mockHonorStore.getHonors.mockRejectedValue(new Error("Honors API error"));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const newWrapper = shallowMount(PathfinderComponent, {
        global: {
          plugins: [createPinia()],
          stubs: {
            PathfinderList: true,
            ModalComponent: true,
            EditPathfinderComponent: true,
            ToasterComponent: true,
            CreatePathfinderForm: true
          }
        }
      });

      await newWrapper.vm.$nextTick();
      
      // Pathfinders should still load successfully
      expect(mockPathfinderStore.getPathfinders).toHaveBeenCalled();
      
      // Honors should be called but error should be caught
      expect(mockHonorStore.getHonors).toHaveBeenCalled();
      
      // Wait a bit for the async honors loading to complete
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error loading honors"),
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    it("should retry loading when retryLoading is called", async () => {
      // Clear mocks and set empty data
      vi.clearAllMocks();
      mockPathfinderStore.pathfinders = [];
      mockHonorStore.honors = [];
      
      const newWrapper = shallowMount(PathfinderComponent, {
        global: {
          plugins: [createPinia()],
          stubs: {
            PathfinderList: true,
            ModalComponent: true,
            EditPathfinderComponent: true,
            ToasterComponent: true,
            CreatePathfinderForm: true
          }
        }
      });

      await newWrapper.vm.$nextTick();
      
      // Clear the mocks to verify retry calls
      vi.clearAllMocks();
      
      // Call retry loading - access it through the component instance
      await (newWrapper.vm as any).retryLoading();
      
      // Both should be called again
      expect(mockPathfinderStore.getPathfinders).toHaveBeenCalled();
      expect(mockHonorStore.getHonors).toHaveBeenCalled();
    });
  });
}); 