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
});
