import { defineStore } from "pinia";
import api from "@/api/pathfinders";

interface Pathfinder {
  pathfinderID: string;
  firstName: string;
  lastName: string;
  pathfinderClass: string;
  grade: number;
  pathfinderHonors: PathfinderHonors[];
}

interface PathfinderHonors {
  pathfinderHonorID: string;
  honorID: string;
  name: string;
  status: string;
}

interface PathfinderHonorPostData {
  honorID: string;
  status: string;
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
    async postPathfinderHonor(pathfinderID: string, honorId: string) {
      this.loading = true;
      this.error = false;
      const postData: PathfinderHonorPostData = {
        honorID: honorId,
        status: "Planned",
      };

      try {
        await api.postPathfinderHonor(pathfinderID, postData);
      } catch (err) {
        this.error = true;
        console.error(`Could add honor, because: ${err}`);
      } finally {
        await this.getPathfinders();
        this.loading = false;
      }
    },
  },
});
