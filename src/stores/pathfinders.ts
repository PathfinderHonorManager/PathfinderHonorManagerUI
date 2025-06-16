import { defineStore } from "pinia";
import api from "@/api/pathfinders";
import { Errors } from "../errors/errors";
import { useSelectionStore, SelectionType } from "./selectionStore";
import {
  Pathfinder,
  PathfinderPost,
  PathfinderHonorPostPut,
  BulkAdd,
  BulkAddResponse,
  status,
} from "@/models/pathfinder";
export type PathfinderStoreType = {
  pathfinders: Pathfinder[];
  loading: boolean;
  error: boolean;

  getPathfindersByGrade: (grade: number) => Pathfinder[];
  getPathfindersBySelection: (selectionType: SelectionType) => Pathfinder[];
  getPathfinderById: (pathfinderID: string) => Promise<void>;
  postPathfinder: (data: PathfinderPost) => Promise<void>;
  postPathfinderHonor: (pathfinderID: string, honorId: string) => Promise<void>;
  putPathfinderHonor: (
    pathfinderID: string,
    honorID: string,
    status: status,
  ) => Promise<void>;
  bulkManagePathfinderHonors: (
    pathfinderIDs: string[],
    honorIDs: string[],
    action: SelectionType,
  ) => Promise<{ successful: any[]; failed: any[] }>;
  updatePathfinder: (
    pathfinderID: string,
    data: { grade: number | null; isActive: boolean | null },
  ) => Promise<void>;
};

export const usePathfinderStore = defineStore("pathfinder", {
  state: () => ({
    pathfinders: [] as Pathfinder[],
    loading: false,
    error: false,
  }),
  getters: {
    getPathfindersByGrade: (state) => (grade: number) => {
      return state.pathfinders.filter((p) => p.grade === grade);
    },

    getPathfindersBySelection: (state) => (selectionType: SelectionType) => {
      const selectionStore = useSelectionStore();
      return state.pathfinders.filter((p) =>
        selectionStore.selections[selectionType].pathfinders.includes(
          p.pathfinderID,
        ),
      );
    },
  },
  actions: {
    sortPathfinderHonors() {
      this.pathfinders.forEach((pathfinder) => {
        if (
          pathfinder.pathfinderHonors &&
          pathfinder.pathfinderHonors.length > 0
        ) {
          pathfinder.pathfinderHonors.sort((a, b) =>
            a.name.localeCompare(b.name),
          );
        }
      });
    },

    async getPathfinders() {
      this.loading = true;
      this.error = false;
      try {
        const response = await api.getAll();
        this.pathfinders = response.data;
        this.sortPathfinderHonors();
      } catch (err) {
        this.error = true;
        console.error(`Could not get pathfinders, because: ${err}`);
      } finally {
        this.loading = false;
      }
    },
    async getPathfinderById(pathfinderID: string) {
      this.loading = true;
      this.error = false;

      try {
        const response = await api.get(pathfinderID);
        const pathfinderIndex = this.pathfinders.findIndex(
          (p) => p.pathfinderID === pathfinderID,
        );
        if (pathfinderIndex !== -1) {
          this.pathfinders[pathfinderIndex] = response.data;
          this.sortPathfinderHonors();
        }
      } catch (err) {
        this.error = true;
        throw Errors.apiResponse.status(err);
      } finally {
        this.loading = false;
      }
    },
    async postPathfinder(data: PathfinderPost) {
      try {
        const response = await api.post(data);
        this.pathfinders.push(response.data);
        this.sortPathfinderHonors();
      } catch (err) {
        console.error(`Can't post this pathfinder because: ${err}`);
        throw err;
      } finally {
        await this.getPathfinders();
        this.loading = false;
      }
    },
    async postPathfinderHonor(pathfinderID: string, honorId: string) {
      this.loading = true;
      this.error = false;
      const postData: PathfinderHonorPostPut = {
        honorID: honorId,
        status: status.Planned,
      };

      try {
        await api.postPathfinderHonor(pathfinderID, postData);
      } catch (err) {
        this.error = true;
        console.error(`Could add honor, because: ${err}`);
      } finally {
        await this.getPathfinderById(pathfinderID);
        this.loading = false;
      }
    },
    async putPathfinderHonor(
      pathfinderID: string,
      honorID: string,
      status: status,
    ) {
      this.loading = true;
      this.error = false;
      const postData: PathfinderHonorPostPut = {
        honorID: honorID,
        status: status,
      };
      try {
        await api.putPathfinderHonor(pathfinderID, honorID, postData);
        await this.getPathfinderById(pathfinderID);
      } catch (err) {
        this.error = true;
        console.error(`Could not update honor, because: ${err}`);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async bulkManagePathfinderHonors(
      pathfinderIDs: string[],
      honorIDs: string[],
      action: SelectionType,
    ) {
      this.loading = true;
      this.error = false;

      try {
        const actionStatus = action === "plan" ? status.Planned : (action === "earn" ? status.Earned : (action === "award" ? status.Awarded : null));
                const postData: BulkAdd[] = pathfinderIDs.map((pathfinderID) => ({
          pathfinderID,
          honors: honorIDs.map((honorID) => ({
            honorID,
            status: actionStatus,
          })),
        }));

        const response = await api.bulkManagePathfinderHonors(postData, action);
        if (response && response.data) {
          const tempPathfinderHonors = {};
          const successful = [];
          const failed = [];

          response.data.forEach((result: BulkAddResponse) => {
            if (
              result.status === 201 ||
              (result.status === 200 && result.pathfinderHonor)
            ) {
              const pathfinderID = result.pathfinderHonor.pathfinderID;
              if (!tempPathfinderHonors[pathfinderID]) {
                tempPathfinderHonors[pathfinderID] = [];
              }
              const existingIndex = tempPathfinderHonors[
                pathfinderID
              ].findIndex(
                (honor) => honor.honorID === result.pathfinderHonor.honorID,
              );
              if (existingIndex > -1) {
                tempPathfinderHonors[pathfinderID].splice(
                  existingIndex,
                  1,
                  result.pathfinderHonor,
                );
              } else {
                tempPathfinderHonors[pathfinderID].splice(
                  tempPathfinderHonors[pathfinderID].length,
                  0,
                  result.pathfinderHonor,
                );
              }
              successful.push(result.pathfinderHonor);
            } else if (result.error) {
              console.error(
                `Could not ${action} pathfinder honors, because: ${result.error}`,
              );
              failed.push(result.error);
            }
          });

          this.pathfinders = this.pathfinders.map((pathfinder) => {
            const honorsToUpdate =
              tempPathfinderHonors[pathfinder.pathfinderID];
            if (honorsToUpdate && pathfinder.pathfinderHonors) {
              pathfinder.pathfinderHonors = pathfinder.pathfinderHonors.filter(
                (honor) =>
                  !honorsToUpdate.some(
                    (updateHonor) => updateHonor.honorID === honor.honorID,
                  ),
              );
              pathfinder.pathfinderHonors.push(...honorsToUpdate);
            } else if (honorsToUpdate) {
              pathfinder.pathfinderHonors = honorsToUpdate;
            }
            return pathfinder;
          });

          this.sortPathfinderHonors();
          return { successful, failed };
        }
      } catch (err) {
        this.error = true;
        console.error(`Could not ${action} pathfinder honors, because: ${err}`);
      } finally {
        this.loading = false;
      }
    },
    async updatePathfinder(
      pathfinderID: string,
      data: { grade: number | null; isActive: boolean | null },
    ) {
      this.loading = true;
      this.error = false;
      try {
        const response = await api.putPathfinder(pathfinderID, data);
        const index = this.pathfinders.findIndex(
          (p) => p.pathfinderID === pathfinderID,
        );
        if (index !== -1) {
          this.pathfinders[index] = { ...this.pathfinders[index], ...data };
        }
        await this.getPathfinders();
      } catch (err) {
        this.error = true;
        if (err instanceof Error) {
          console.error(`${err.message}`);
          throw new Error(`${err.message}`);
        } else {
          console.error(
            `Could not update pathfinder due to an unexpected error`,
          );
          throw new Error(
            `Could not update pathfinder due to an unexpected error`,
          );
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
