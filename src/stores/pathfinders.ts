import { defineStore } from "pinia";
import { pathfinders } from "@/helpers/fetchHandler";

export const usePathfinderStore = defineStore("pathfinder", {
  state: () => ({
    firstName: "Default",
    lastName: "User",
    pathfinderClass: "none",
    grade: 12,
    honors: [],
  }),
  getters: {
    getPathfinders: () => {
      return pathfinders;
    },
  },
  actions: {},
});
