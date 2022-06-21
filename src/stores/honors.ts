import { defineStore } from "pinia";
import api from "@/api/honors";
import type { Url } from "url";

// Define the data shape of a pathfinder
interface Honor {
  honorID: string;
  name: string;
  level: number;
  description: string;
  pathPath: Url;
  wikiPath: Url;
}

export const useHonorStore = defineStore("honor", {
  state: () => ({
    honors: [] as Honor[],
    loading: false,
    error: false,
  }),
  getters: {
    getHonorsByLevel: (state) => (level: number) => {
      return state.honors.filter((h) => h.level === level);
    },
    getHonorsByQuery: (state) => (string: string) => {
      const query = string.split(" ");
      return state.honors.filter((h) => {
        const passes = query.filter((q) => h.name.indexOf(q) > -1).length;
        return !(passes - query.length); //if passing tokens length is the same as original tokens length, return true, otherwise return false.
      });
    },
  },
  actions: {
    async getHonors() {
      this.loading = true;
      this.error = false;

      try {
        const response = await api.getAll();
        this.honors = response.data;
      } catch (err) {
        this.error = true;
        console.error(`Could not get honors, because: ${err}`);
      } finally {
        this.loading = false;
      }
    },
  },
  persist: {
    enabled: true,
  },
});
