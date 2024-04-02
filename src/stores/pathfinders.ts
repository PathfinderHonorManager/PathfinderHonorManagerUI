import { defineStore } from "pinia";
import api from "@/api/pathfinders";
import { Errors } from "../errors/errors";
import {
  Pathfinder,
  PathfinderPost,
  PathfinderHonorPostPut,
  BulkAdd,
  BulkAddResponse,
  status,
} from "@/models/pathfinder";
// Define the type
export type PathfinderStoreType = {
  // State
  pathfinders: Pathfinder[];
  loading: boolean;
  error: boolean;
  selected: string[];

  // Getters
  getPathfindersByGrade: (grade: number) => Pathfinder[];
  getPathfindersBySelection: () => Pathfinder[];
  getSelected: () => string[];
  isSelected: (pathfinderID: string) => boolean;

  // Actions
  getPathfinders: () => Promise<void>;
  getPathfinderById: (pathfinderID: string) => Promise<void>;
  postPathfinder: (data: PathfinderPost) => Promise<void>;
  postPathfinderHonor: (pathfinderID: string, honorId: string) => Promise<void>;
  putPathfinderHonor: (
    pathfinderID: string,
    honorID: string,
    status: status,
  ) => Promise<void>;
  bulkAddPathfinderHonors: (
    pathfinderIDs: string[],
    honorIDs: string[],
  ) => Promise<{ successful: any[]; failed: any[] }>;
  selectPathfinder: (pathfinderID: string) => void;
  selectAll: () => void;
  toggleSelection: (pathfinderID: string) => void;
  clearSelection: () => void;
  updatePathfinder: (
    pathfinderID: string,
    data: { grade: number | null; isActive: boolean | null },
  ) => Promise<void>;
};

export const usePathfinderStore = defineStore("pathfinder", {
  state: () => ({
    // define the data shape of the store using the interface above
    // I'm assuming that the data from the api returns an array of pathfinders
    pathfinders: [] as Pathfinder[],
    loading: false,
    error: false,
    selected: [] as string[],
  }),
  getters: {
    // getters are functions that return values from the state
    // they are used to calculate values from the state, like a filtered list or a sum
    getPathfindersByGrade: (state) => (grade: number) => {
      return state.pathfinders.filter((p) => p.grade === grade);
    },
    getPathfindersBySelection: (state) => () => {
      return state.pathfinders.filter(
        (p) => state.selected.indexOf(p.pathfinderID) > -1,
      );
    },
    getSelected: (state) => () => {
      return state.selected;
    },
    isSelected: (state) => (pathfinderID: string) => {
      return state.selected.indexOf(pathfinderID) > -1;
    },
  },
  actions: {
    // actions are functions that modify the state
    // they are used to call API requests or to modify the state in some other way
    async getPathfinders() {
      this.loading = true;
      this.error = false;
      try {
        const response = await api.getAll();
        this.pathfinders = response.data;
      } catch (err) {
        this.error = true;
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          "status" in err.response
        ) {
          if (err.response.status === 404) {
            throw Errors.apiResponse.status(err.response.status);
          }
        } else {
          console.error(`Could not get pathfinders, because: ${err}`);
          throw Errors.apiResponse.body(
            `Could not get pathfinders, because: ${err}`,
          );
        }
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
        this.pathfinders[pathfinderIndex] = response.data;
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
      } catch (err) {
        console.error(`Can't post this pathfinder because: ${err}`);
      } finally {
        await api.getAll();
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
    async bulkAddPathfinderHonors(pathfinderIDs: string[], honorIDs: string[]) {
      this.loading = true;
      this.error = false;

      try {
        const postData: BulkAdd[] = pathfinderIDs.map((pathfinderID) => ({
          pathfinderID,
          honors: honorIDs.map((honorID) => ({
            honorID,
            status: status.Planned,
          })),
        }));

        const response = await api.bulkAddPathfinderHonors(postData);

        if (response && response.data) {
          const tempPathfinderHonors = {};
          const successful = [];
          const failed = [];

          response.data.forEach((result: BulkAddResponse) => {
            if (result.status === 201 && result.pathfinderHonor) {
              const pathfinderID = result.pathfinderHonor.pathfinderID;
              if (!tempPathfinderHonors[pathfinderID]) {
                tempPathfinderHonors[pathfinderID] = [];
              }
              tempPathfinderHonors[pathfinderID].push(result.pathfinderHonor);
              successful.push(result.pathfinderHonor);
            } else if (result.error) {
              console.error(`Could not add honors, because: ${result.error}`);
              failed.push(result.error);
            }
          });

          this.pathfinders = this.pathfinders.map((pathfinder) => {
            if (tempPathfinderHonors[pathfinder.pathfinderID]) {
              return {
                ...pathfinder,
                pathfinderHonors: [
                  ...pathfinder.pathfinderHonors,
                  ...tempPathfinderHonors[pathfinder.pathfinderID],
                ],
              };
            } else {
              return pathfinder;
            }
          });

          // Return the successful and failed operations
          return { successful, failed };
        }
      } catch (err) {
        this.error = true;
        console.error(`Could not add pathfinder honors, because: ${err}`);
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
        // Find the index of the pathfinder to update
        const index = this.pathfinders.findIndex(
          (p) => p.pathfinderID === pathfinderID,
        );
        if (index !== -1) {
          // Update the pathfinder in the local store
          this.pathfinders[index] = { ...this.pathfinders[index], ...data };
        }
        // Refresh the pathfinders list from the API after successful update
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
    selectPathfinder(pathfinderID: string) {
      if (this.selected.includes(pathfinderID)) {
        throw Errors.selectHonor.alreadySelected;
      }
      this.selected = [...this.selected, pathfinderID];
      return;
    },
    selectAll() {
      this.selected = this.pathfinders.map((p) => p.pathfinderID);
      console.log(this.selected);
    },
    toggleSelection(pathfinderID: string) {
      const s = this.getSelected();
      if (s.indexOf(pathfinderID) > -1) {
        this.selected = s.filter((p) => p !== pathfinderID);
      } else {
        this.selectPathfinder(pathfinderID);
      }
      console.log(this.getSelected());
    },
    clearSelection() {
      this.selected = [] as string[];
    },
  },
});
