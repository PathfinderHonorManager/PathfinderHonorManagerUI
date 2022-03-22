import { defineStore } from "pinia";
import api from "@/api/pathfinders";

// Define the data shape of a pathfinder
interface Pathfinder {
  firstName: string;
  lastName: string;
  pathfinderClass: string;
  grade: number;
  honors: any[]; // not sure how this is supposed to look
}

export const usePathfinderStore = defineStore("pathfinder", {
  state: () => ({
    pathfinders: [] as Pathfinder[], // define the data shape of the store using the interface above
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
    async getPathFinders() {
      try {
        const response = await api.get();
        this.pathfinders = response.data; // i'm not sure how the response data is supposed to look, but this is where you set the state
      } catch (err) {
        console.error(`Could not get pathfinders, because: ${err}`);
      }
    },
  },
});
