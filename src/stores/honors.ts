import { defineStore } from "pinia";
import { honors } from "@/helpers/fetchHandler";

export const useHonorStore = defineStore("honors", {
  state: () => ({
    singleFocus: [],
    groupFocus: [],
    bigImg: "",
  }),
  getters: {
    getHonors: () => {
      return honors;
    },
  },
  actions: {},
});
