<template>
  <div>
    <input
      v-model="searchQuery"
      @input="doHonorSearch"
      type="text"
      placeholder="Search..."
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useHonorStore } from "@/stores/honors"; // Adjust the path as necessary

export default defineComponent({
  name: "HonorSearchComponent",
  setup(_, { emit }) {
    const honorStore = useHonorStore();
    const searchQuery = ref("");

    function doHonorSearch() {
      const result =
        searchQuery.value !== ""
          ? honorStore.getHonorsByQuery(searchQuery.value)
          : [];
      emit("search-result", result);
    }

    return {
      searchQuery,
      doHonorSearch,
    };
  },
});
</script>
