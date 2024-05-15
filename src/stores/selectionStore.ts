import { defineStore } from "pinia";
export type SelectionType = "plan" | "earn" | "award";
export type CategoryType = "pathfinders" | "honors";

export interface Selections {
  plan: {
    pathfinders: string[];
    honors: string[];
  };
  earn: {
    pathfinders: string[];
    honors: string[];
  };
  award: {
    pathfinders: string[];
    honors: string[];
  };
}

export type SelectionStoreType = {
  selections: Selections;

  toggleSelection: (
    type: SelectionType,
    id: string,
    category: CategoryType,
  ) => void;
  clearSelection: (type: SelectionType) => void;
  isSelected: (
    type: SelectionType,
    id: string,
    category: CategoryType,
  ) => boolean;
};

export const useSelectionStore = defineStore("selectionStore", {
  state: () => ({
    selections: {
      plan: {
        pathfinders: [] as string[],
        honors: [] as string[],
      },
      earn: {
        pathfinders: [] as string[],
        honors: [] as string[],
      },
      award: {
        pathfinders: [] as string[],
        honors: [] as string[],
      },
    },
  }),
  actions: {
    toggleSelection(
      type: "plan" | "earn" | "award",
      id: string,
      category: "pathfinders" | "honors",
    ) {
      const index = this.selections[type][category].indexOf(id);
      if (index > -1) {
        this.selections[type][category].splice(index, 1);
      } else {
        this.selections[type][category].push(id);
      }
    },
    clearSelection(type: SelectionType) {
      this.selections[type].pathfinders = [];
      this.selections[type].honors = [];
    },
    isSelected(
      type: "plan" | "earn" | "award",
      id: string,
      category: "pathfinders" | "honors",
    ) {
      return this.selections[type][category].includes(id);
    },
  },
});
