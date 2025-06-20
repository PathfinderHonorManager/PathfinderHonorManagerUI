import { defineStore } from "pinia";
export type SelectionType = "plan" | "earn" | "award" | "investiture" | "achievements";
export type CategoryType = "pathfinders" | "honors" | "achievements";

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
  investiture: {
    pathfinders: string[];
    honors: string[];
  };
  achievements: {
    pathfinders: string[];
    honors: string[];
    achievements: string[];
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
      investiture: {
        pathfinders: [] as string[],
        honors: [] as string[],
      },
      achievements: {
        pathfinders: [] as string[],
        honors: [] as string[],
        achievements: [] as string[],
      },
    },
  }),
  actions: {
    toggleSelection(
      type: SelectionType,
      id: string,
      category: CategoryType,
    ) {
      if (type === "achievements" && category === "achievements") {
        const index = this.selections.achievements.achievements.indexOf(id);
        if (index > -1) {
          this.selections.achievements.achievements.splice(index, 1);
        } else {
          this.selections.achievements.achievements.push(id);
        }
      } else {
        const index = this.selections[type][category as "pathfinders" | "honors"].indexOf(id);
        if (index > -1) {
          this.selections[type][category as "pathfinders" | "honors"].splice(index, 1);
        } else {
          this.selections[type][category as "pathfinders" | "honors"].push(id);
        }
      }
    },
    clearSelection(type: SelectionType) {
      this.selections[type].pathfinders = [];
      this.selections[type].honors = [];
      if (type === "achievements") {
        this.selections[type].achievements = [];
      }
    },
    isSelected(
      type: SelectionType,
      id: string,
      category: CategoryType,
    ) {
      if (type === "achievements" && category === "achievements") {
        return this.selections.achievements.achievements.includes(id);
      } else {
        return this.selections[type][category as "pathfinders" | "honors"].includes(id);
      }
    },
  },
});
