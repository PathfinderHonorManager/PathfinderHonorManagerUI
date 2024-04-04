import { defineStore } from "pinia";
import api from "@/api/honors";
import type { Url } from "url";
import { Errors } from "../errors/errors";
import { useSelectionStore } from "./selectionStore"; // Ensure the selectionStore is imported

interface IHonor {
  honorID: string;
  name: string;
  level: number;
  description: string;
  pathPath: Url;
  wikiPath: Url;
}

export type HonorStoreType = {
  honors: IHonor[];
  loading: boolean;
  error: boolean;

  getHonorsByLevel: (level: number) => IHonor[];
  getHonorsByQuery: (query: string) => IHonor[];
  getHonorsBySelection: (selectionType: "plan" | "earn") => IHonor[];
  getHonors: () => Promise<void>;
};

export const useHonorStore = defineStore("honorStore", {
  state: () => ({
    honors: [] as IHonor[],
    loading: false,
    error: false,
  }),
  getters: {
    getHonorsByLevel: (state) => (level: number) => {
      return state.honors.filter((h) => h.level === level);
    },
    getHonorsByQuery: (state) => (query: string) => {
      const tokens = query.toLowerCase().split(" ");
      return state.honors.filter(
        (h) =>
          tokens.filter((t) => h.name.toLowerCase().indexOf(t) > -1).length ===
          tokens.length,
      );
    },
    getHonorsBySelection: (state) => (selectionType: "plan" | "earn") => {
      const selectionStore = useSelectionStore();
      if (!selectionStore.selections[selectionType]) {
        console.error(`Selection type ${selectionType} is not valid.`);
        return [];
      }
      return (
        state.honors.filter((h) =>
          selectionStore.selections[selectionType].honors.includes(h.honorID),
        ) || []
      );
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
