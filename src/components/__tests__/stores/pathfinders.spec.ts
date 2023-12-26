import { describe, it, expect, beforeEach } from "vitest";
import { usePathfinderStore } from "@/stores/pathfinders";
import { createPinia, setActivePinia } from "pinia";
import { status } from "@/models/pathfinder";

describe("Pathfinder Store", () => {
  let store;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = usePathfinderStore();
  });

  const mockPathfinders = [
    {
      pathfinderID: "34f93233-7c0a-48a7-81fc-2fa56473874a",
      firstName: "Sally",
      lastName: "Forth",
      className: "Friend",
      grade: 5,
      pathfinderHonors: [
        {
          pathfinderHonorID: "ada33ac7-2333-4316-9449-65f49688bafb",
          pathfinderID: "34f93233-7c0a-48a7-81fc-2fa56473874a",
          honorID: "1c82e3ae-1968-11ec-ae66-d7248c0cf660",
          name: "Animal Tracking",
          status: status.Earned,
          patchPath: "Animal_Tracking_Honor.png",
        },
        {
          pathfinderHonorID: "95792053-6140-4ba9-b114-2bd249b62875",
          pathfinderID: "34f93233-7c0a-48a7-81fc-2fa56473874a",
          honorID: "1c82e688-1968-11ec-ae66-8f33c066236e",
          name: "Barbering and Hairstyling",
          status: status.Planned,
          patchPath: "Barbering_Honor.png",
        },
        // Add other honors if needed
      ],
    },
    {
      pathfinderID: "2af9f458-939c-4072-ad88-e25224412c8e",
      firstName: "Bobo",
      lastName: "TheClown",
      className: "Explorer",
      grade: 7,
      pathfinderHonors: [
        {
          pathfinderHonorID: "16284fc0-25e8-4093-9b99-202ad5865e68",
          pathfinderID: "2af9f458-939c-4072-ad88-e25224412c8e",
          honorID: "1c82e4e4-1968-11ec-ae66-376e19f0534f",
          name: "Archery",
          status: status.Planned,
          patchPath: "Archery_Honor.png",
        },
        {
          pathfinderHonorID: "c13ec22b-d8e6-4265-bb7a-22756b57979e",
          pathfinderID: "2af9f458-939c-4072-ad88-e25224412c8e",
          honorID: "1c82ffe2-1968-11ec-ae66-13127274ac7e",
          name: "Blood and the Body's Defenses",
          status: status.Planned,
          patchPath: "Blood_Defenses.png",
        },
        {
          pathfinderHonorID: "7e4d13f4-5f56-47c0-a3ee-c1e0fee4247b",
          pathfinderID: "2af9f458-939c-4072-ad88-e25224412c8e",
          honorID: "1c8490fa-1968-11ec-ae66-57cc28bd7e03",
          name: "Optics",
          status: status.Planned,
          patchPath: "Optics_Honor.png",
        },
        // Add other honors if needed
      ],
      // Add other pathfinders if needed
    },
  ];

  describe("Initial State", () => {
    it("should have an empty pathfinders array", () => {
      expect(store.pathfinders).toEqual([]);
    });

    it("should have loading as false", () => {
      expect(store.loading).toBe(false);
    });

    it("should have error as false", () => {
      expect(store.error).toBe(false);
    });

    it("should have an empty selected array", () => {
      expect(store.selected).toEqual([]);
    });
  });

  describe("Getters", () => {
    beforeEach(() => {
      store.$reset();
      store.pathfinders = mockPathfinders;
    });
    // Populate the store with mock data first

    it("getPathfindersByGrade", () => {
      const result = store.getPathfindersByGrade(5);
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe("Sally");
    });

    it("getPathfindersBySelection", () => {
      // Assuming getPathfindersBySelection retrieves pathfinders based on a list of IDs
      const selectedIDs = [
        mockPathfinders[0].pathfinderID,
        mockPathfinders[1].pathfinderID,
      ];
      store.selected = selectedIDs;
      const selectedPathfinders = store.getPathfindersBySelection();
      expect(selectedPathfinders).toEqual([
        mockPathfinders[0],
        mockPathfinders[1],
      ]);
      // This expects the selected pathfinders to match the ones with the specified IDs
    });

    it("getSelected", () => {
      // This test checks the 'selected' array in the store
      const selectedIDs = [mockPathfinders[0].pathfinderID];
      store.selected = selectedIDs;
      const selected = store.getSelected();
      expect(selected).toEqual(selectedIDs);
      // This expects the 'selected' array to contain the ID of the first mock pathfinder
    });

    it("isSelected", () => {
      // This test checks if a specific pathfinder ID is in the 'selected' array
      const pathfinderID = mockPathfinders[0].pathfinderID;
      store.selected = [pathfinderID];
      const isSelected = store.isSelected(pathfinderID);
      expect(isSelected).toBe(true);
      // This test expects the pathfinder with the given ID to be selected
    });
  });
});
