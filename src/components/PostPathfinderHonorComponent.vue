<template>
  <form @submit.prevent="postPathfinderHonor(pathfinderID, postHonorID)">
    <vue3-simple-typeahead
      id="typeahead_id"
      placeholder="Search Honors"
      :items="honors"
      :minInputLength="1"
      @selectItem="selectItem"
      :itemProjection="
        (item) => {
          return item.name;
        }
      "
    >
    </vue3-simple-typeahead>
    <button style="margin: var(--standard); margin-top: 0; width: 80%;">Post New Honor</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { usePathfinderStore } from "../stores/pathfinders";
import { useHonorStore } from "../stores/honors";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();
    const postHonorID = "";

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const { honors } = storeToRefs(honorStore);

    return {
      loading,
      error,
      pathfinders,
      honors,
      getPathfinders: pathfinderStore.getPathfinders,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      postHonorID,
    };
  },
  methods: {
    selectItem(item) {
      this.postHonorID = item.honorID;
    },
  },
  props: {
    pathfinderID: {
      type: String,
      required: true,
    },
  },
});
</script>
