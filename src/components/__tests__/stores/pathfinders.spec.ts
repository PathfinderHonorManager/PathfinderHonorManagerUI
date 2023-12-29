import { describe, it, expect, beforeEach, vi } from "vitest";
import { usePathfinderStore } from "@/stores/pathfinders";
import { createPinia, setActivePinia } from "pinia";
import { status } from "@/models/pathfinder";
import api from "@/api/pathfinders";
// mockAxiosResponse.ts

import { AxiosResponse, AxiosHeaders } from "axios";

export const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: { headers: {} as AxiosHeaders },
  request: {},
});

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
          status: status.Planned,
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
      ],
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

  describe("Actions", () => {
    beforeEach(() => {
      store.$reset();
      vi.resetAllMocks();
      store.pathfinders = mockPathfinders;
    });

    it("getPathfinders should update pathfinders and reset loading and error", async () => {
      vi.spyOn(api, "getAll").mockResolvedValue(
        mockAxiosResponse(mockPathfinders)
      );

      await store.getPathfinders();

      expect(store.pathfinders).toEqual(mockPathfinders);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(false);
    });

    it("post should add a new pathfinder to the store", async () => {
      const newPathfinder = {
        firstName: "Peter",
        lastName: "Cottontail",
        className: "Guide",
        grade: 10,
      };

      // Use the mockAxiosResponse function to create a mock response
      vi.spyOn(api, "post").mockResolvedValue(mockAxiosResponse(newPathfinder));

      await store.postPathfinder(newPathfinder);

      // Assuming the store's `pathfinders` array is updated after calling post
      expect(store.pathfinders).toContainEqual(newPathfinder);
    });

    it("putPathfinderHonor should update an honor's status for a specific pathfinder", async () => {
      const pathfinderID = mockPathfinders[0].pathfinderID;
      const honorToUpdate = mockPathfinders[0].pathfinderHonors[0];
      const updatedHonor = { ...honorToUpdate, status: status.Earned };

      // Mock the putPathfinderHonor API call with an empty response
      vi.spyOn(api, "putPathfinderHonor").mockResolvedValue(
        mockAxiosResponse({})
      );

      // Prepare updated pathfinder data for the mock get response
      const updatedPathfinderData = {
        ...mockPathfinders[0],
        pathfinderHonors: mockPathfinders[0].pathfinderHonors.map((honor) =>
          honor.pathfinderHonorID === honorToUpdate.pathfinderHonorID
            ? updatedHonor
            : honor
        ),
      };

      // Mock the get API call used in getPathfinderById
      vi.spyOn(api, "get").mockResolvedValue(
        mockAxiosResponse(updatedPathfinderData)
      );

      // Act
      await store.putPathfinderHonor(
        pathfinderID,
        honorToUpdate.honorID,
        updatedHonor.status
      );

      // Wait for the store to update
      await store.getPathfinderById(pathfinderID);

      // Assert
      const updatedPathfinder = store.pathfinders.find(
        (p) => p.pathfinderID === pathfinderID
      );
      const updatedHonorInStore = updatedPathfinder.pathfinderHonors.find(
        (h) => h.pathfinderHonorID === honorToUpdate.pathfinderHonorID
      );
      expect(updatedHonorInStore.status).toBe(status.Earned);
    });

    it("bulkAddPathfinderHonors should add multiple honors to multiple pathfinders", async () => {
      const pathfinderIDs = [
        mockPathfinders[0].pathfinderID,
        mockPathfinders[1].pathfinderID,
      ];

      const honorIDs = [
        "ba61fbec-0575-47bd-8732-a6d74314beba",
        "b267e7d8-f2a6-4eb9-99ac-e5054de0b804",
      ]; // Randomly generated GUIDs

      // Prepare bulk add data
      const bulkAddData = pathfinderIDs.map((id) => ({
        pathfinderID: id,
        honors: honorIDs.map((honorID) => ({
          honorID,
          status: status.Planned,
        })),
      }));

      // Mock response for bulkAddPathfinderHonors
      const mockBulkAddResponse = bulkAddData.flatMap((item) =>
        item.honors.map((honor) => ({
          status: 201,
          pathfinderHonor: {
            pathfinderHonorID: honor.honorID,
            pathfinderID: item.pathfinderID,
            honorID: honor.honorID,
            name: "Mock Honor Name",
            status: "Planned",
            patchFilename: "mock_patch_filename.png",
            wikiPath: "https://wiki.pathfindersonline.org/mock_honor",
          },
        }))
      );

      vi.spyOn(api, "bulkAddPathfinderHonors").mockResolvedValue(
        mockAxiosResponse(mockBulkAddResponse)
      );
      // Act
      await store.bulkAddPathfinderHonors(pathfinderIDs, honorIDs);
      // Assert
      pathfinderIDs.forEach((pathfinderID) => {
        const pathfinder = store.pathfinders.find(
          (p) => p.pathfinderID === pathfinderID
        );

        // Check if the pathfinder's honors contain the new honor IDs
        const hasNewHonors = honorIDs.every((honorID) =>
          pathfinder.pathfinderHonors.some((honor) => honor.honorID === honorID)
        );

        expect(hasNewHonors).toBeTruthy();
      });
    });
  });
});
