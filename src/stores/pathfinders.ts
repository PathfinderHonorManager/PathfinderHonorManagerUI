import { defineStore } from "pinia";
import api from "@/api/pathfinders";

export enum status {
  Planned = "Planned",
  Earned = "Earned",
  Awarded = "Awarded",
}

interface Pathfinder {
  pathfinderID: string;
  firstName: string;
  lastName: string;
  className: string;
  grade: number;
  pathfinderHonors: PathfinderHonors[];
}

interface PathfinderHonors {
  pathfinderHonorID: string;
  honorID: string;
  name: string;
  status: string;
  patchPath: string;
}

interface PathfinderHonorPostPut {
  honorID: string;
  status: status;
}

export const usePathfinderStore = defineStore("pathfinder", {
  state: () => ({
    // define the data shape of the store using the interface above
    // I'm assuming that the data from the api returns an array of pathfinders
    pathfinders: [] as Pathfinder[],
    loading: false,
    error: false,
  }),
  getters: {
    // getters are functions that return values from the state
    // they are used to calculate values from the state, like a filtered list or a sum
    getPathfindersByGrade: (state) => (grade: number) => {
      return state.pathfinders.filter((p) => p.grade === grade);
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
          (p) => p.pathfinderID === pathfinderID
        );
        this.pathfinders[pathfinderIndex] = response.data;
      } catch (err) {
        this.error = true;
        console.error(`Could not get pathfinders, because: ${err}`);
      } finally {
        this.loading = false;
      }
    },
    postPathfinder(firstName: string, lastName: string, email: string, grade: number) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        grade: grade,
      }
      try {
        api.post(data);
      } catch (err) {
        console.error(`Can't post this pathfinder because: ${err}`);
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
      honorId: string,
      status: status
    ) {
      this.loading = true;
      this.error = false;
      const putData: PathfinderHonorPostPut = {
        honorID: honorId,
        status: status,
      };

      try {
        await api.putPathfinderHonor(pathfinderID, honorId, putData);
      } catch (err) {
        this.error = true;
        console.error(`Could modify honor, because: ${err}`);
      } finally {
        await this.getPathfinderById(pathfinderID);
        this.loading = false;
      }
    },
  },
});
