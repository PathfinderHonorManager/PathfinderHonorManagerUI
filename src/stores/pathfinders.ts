import { defineStore } from "pinia";
import api from "@/api/pathfinders";
import { Errors } from "../errors/errors";
import type { AxiosResponse } from "axios";
import {
  Pathfinder,
  PathfinderPost,
  PathfinderHonors,
  PathfinderHonorPostPut,
  BulkAdd,
  BulkAddResponse,
  status,
} from "@/models/pathfinder";

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
        (p) => state.selected.indexOf(p.pathfinderID) > -1
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
      } catch (err: any) {
        this.error = true;
        if (err.response && err.response.status) {
          if (err.response.status === 404) {
            throw Errors.apiResponse.status(err.response.status);
          }
        } else {
          console.error(`Could not get pathfinders, because: ${err}`);
          throw Errors.apiResponse.body(
            `Could not get pathfinders, because: ${err}`
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
          (p) => p.pathfinderID === pathfinderID
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
      status: status
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
        throw err; // You can handle or rethrow the error as per your needs
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

          response.data.forEach((result: BulkAddResponse) => {
            if (result.status === 201 && result.pathfinderHonor) {
              const pathfinderID = result.pathfinderHonor.pathfinderID;
              if (!tempPathfinderHonors[pathfinderID]) {
                tempPathfinderHonors[pathfinderID] = [];
              }
              tempPathfinderHonors[pathfinderID].push(result.pathfinderHonor);
            } else if (result.error) {
              console.error(`Could not add honors, because: ${result.error}`);
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
        }
      } catch (err) {
        this.error = true;
        console.error(`Could not add pathfinder honors, because: ${err}`);
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
