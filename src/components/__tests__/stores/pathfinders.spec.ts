import { describe, it, expect, beforeEach, vi } from "vitest";
import { usePathfinderStore } from "@/stores/pathfinders";
import { createPinia, setActivePinia } from "pinia";
import { status } from "@/models/pathfinder";
import api from "@/api/pathfinders";
import { useSelectionStore } from "@/stores/selectionStore";
import { AxiosHeaders } from "axios";
import type { AxiosResponse } from "axios";

const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: new AxiosHeaders(),
  config: { headers: new AxiosHeaders() },
  request: {},
});

describe("Pathfinder Store", () => {
  let store;
  let selectionStore;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = usePathfinderStore();
    selectionStore = useSelectionStore();
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
  });

  describe("Getters", () => {
    beforeEach(() => {
      store.$reset();
      store.pathfinders = mockPathfinders;
    });

    it("getPathfindersByGrade", () => {
      const result = store.getPathfindersByGrade(5);
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe("Sally");
    });

    it("getPathfindersBySelection", () => {
      const selectedPathfinderIDs = [mockPathfinders[0].pathfinderID];
      selectionStore.selections = {
        plan: { pathfinders: selectedPathfinderIDs, honors: [] }
      };
      const result = store.getPathfindersBySelection("plan");
      expect(result).toHaveLength(1);
      expect(result[0].pathfinderID).toBe(selectedPathfinderIDs[0]);
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
        mockAxiosResponse(mockPathfinders),
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

      vi.spyOn(api, "post").mockResolvedValue(mockAxiosResponse(newPathfinder));
      vi.spyOn(api, "getAll").mockResolvedValue(
        mockAxiosResponse([...mockPathfinders, newPathfinder])
      );

      await store.postPathfinder(newPathfinder);
      expect(store.pathfinders).toContainEqual(newPathfinder);
    });

    it("putPathfinderHonor should update an honor's status for a specific pathfinder", async () => {
      const pathfinderID = mockPathfinders[0].pathfinderID;
      const honorToUpdate = mockPathfinders[0].pathfinderHonors[0];
      const updatedHonor = { ...honorToUpdate, status: status.Earned };

      vi.spyOn(api, "putPathfinderHonor").mockResolvedValue(
        mockAxiosResponse({}),
      );

      const updatedPathfinderData = {
        ...mockPathfinders[0],
        pathfinderHonors: mockPathfinders[0].pathfinderHonors.map((honor) =>
          honor.pathfinderHonorID === honorToUpdate.pathfinderHonorID
            ? updatedHonor
            : honor,
        ),
      };

      vi.spyOn(api, "get").mockResolvedValue(
        mockAxiosResponse(updatedPathfinderData),
      );

      await store.putPathfinderHonor(
        pathfinderID,
        honorToUpdate.honorID,
        status.Earned,
      );

      await store.getPathfinderById(pathfinderID);

      const updatedPathfinder = store.pathfinders.find(
        (p) => p.pathfinderID === pathfinderID,
      );
      const updatedHonorInStore = updatedPathfinder.pathfinderHonors.find(
        (h) => h.pathfinderHonorID === honorToUpdate.pathfinderHonorID,
      );
      expect(updatedHonorInStore.status).toBe(status.Earned);
    });

    it("bulkManagePathfinderHonors should add multiple honors to multiple pathfinders", async () => {
      const pathfinderIDs = [
        mockPathfinders[0].pathfinderID,
        mockPathfinders[1].pathfinderID,
      ];

      const honorIDs = [
        "ba61fbec-0575-47bd-8732-a6d74314beba",
        "b267e7d8-f2a6-4eb9-99ac-e5054de0b804",
      ];

      const mockBulkAddResponse = pathfinderIDs.flatMap(pathfinderID =>
        honorIDs.map(honorID => ({
          status: 201,
          pathfinderHonor: {
            pathfinderHonorID: `${pathfinderID}-${honorID}`,
            pathfinderID,
            honorID,
            name: "Mock Honor",
            status: status.Planned,
            patchPath: "mock.png"
          }
        }))
      );

      vi.spyOn(api, "bulkManagePathfinderHonors").mockResolvedValue(
        mockAxiosResponse(mockBulkAddResponse)
      );

      const result = await store.bulkManagePathfinderHonors(pathfinderIDs, honorIDs, "plan");

      expect(result?.successful).toHaveLength(4);
      expect(result?.failed).toHaveLength(0);

      // Verify the store was updated
      pathfinderIDs.forEach(pathfinderID => {
        const pathfinder = store.pathfinders.find(p => p.pathfinderID === pathfinderID);
        honorIDs.forEach(honorID => {
          const hasHonor = pathfinder?.pathfinderHonors.some(h => h.honorID === honorID);
          expect(hasHonor).toBe(true);
        });
      });
    });
  });
});
