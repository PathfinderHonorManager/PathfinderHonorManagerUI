import { defineStore } from "pinia";
import api from "@/api/honors";
import type { Url } from "url";
import { Errors } from "../errors/errors";

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
  selected: string[];
  selectedForEarn: string[];

  getHonorsByLevel: (level: number) => IHonor[];
  getHonorsByQuery: (query: string) => IHonor[];
  getHonorsBySelection: () => IHonor[];
  getSelected: () => string[];
  isSelected: (honorID: string) => boolean;

  selectHonorForEarn: (honorID: string) => void;
  toggleSelectionForEarn: (honorID: string) => void;
  clearSelectionForEarn: () => void;
  isSelectedForEarn: (honorID: string) => boolean;

  getHonors: () => Promise<void>;
  selectHonor: (honorID: string) => void;
  toggleSelection: (honorID: string) => void;
  clearSelection: () => void;
};

export const useHonorStore = defineStore("honorStore", {
  state: () => ({
    honors: [] as IHonor[],
    loading: false,
    error: false,
    selected: [] as string[],
    selectedForEarn: [] as string[],
  }),
  getters: {
    getHonorsByLevel: (state) => (level: number) => {
      return state.honors.filter((h) => h.level === level);
    },
    getHonorsByQuery: (state) => (query: string) => {
      console.log(query);
      const tokens = query.toLowerCase().split(" ");
      return state.honors.filter(
        (h) =>
          tokens.filter((t) => h.name.toLowerCase().indexOf(t) > -1).length ===
          tokens.length,
      );
    },
    getHonorsBySelection: (state) => () => {
      return state.honors.filter((h) => state.selected.indexOf(h.honorID) > -1);
    },
    getHonorsBySelectionForEarn: (state) => () => {
      return state.honors.filter(
        (h) => state.selectedForEarn.indexOf(h.honorID) > -1,
      );
    },
    getSelected: (state) => () => {
      console.log(state.selected);
      return state.selected;
    },
    getSelectedForEarn: (state) => () => {
      console.log(state.selectedForEarn);
      return state.selectedForEarn;
    },
    isSelected: (state) => (honorID: string) => {
      return state.selected.indexOf(honorID) > -1;
    },
    isSelectedForEarn: (state) => (honorID: string) => {
      return state.selectedForEarn.indexOf(honorID) > -1;
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
    selectHonor(honorID: string) {
      if (this.selected.includes(honorID)) {
        throw Errors.selectHonor.alreadySelected;
      }
      this.selected = [...this.selected, honorID];
      return;
    },
    toggleSelection(honorID: string) {
      const s = this.getSelected();
      if (s.indexOf(honorID) > -1) {
        this.selected = s.filter((h) => h !== honorID);
      } else {
        this.selectHonor(honorID);
      }
      console.log(this.getSelected());
    },
    clearSelection() {
      this.selected = [] as string[];
    },
    selectHonorForEarn(honorID: string) {
      if (this.selectedForEarn.includes(honorID)) {
        throw Errors.selectHonor.alreadySelected;
      }
      this.selectedForEarn = [...this.selectedForEarn, honorID];
    },
    toggleSelectionForEarn(honorID: string) {
      if (this.isSelectedForEarn(honorID)) {
        this.selectedForEarn = this.selectedForEarn.filter(
          (id) => id !== honorID,
        );
      } else {
        this.selectHonorForEarn(honorID);
      }
    },
    clearSelectionForEarn() {
      this.selectedForEarn = [];
    },
  },
});
