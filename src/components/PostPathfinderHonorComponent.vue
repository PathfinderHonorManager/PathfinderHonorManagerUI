<template>
  <div class="content-box">
    <form @submit.prevent="postPathfinderHonor(pathfinderID, postHonorID)">
      <vue3-simple-typeahead
        id="typeahead_id"
        placeholder="Search Honors"
        :items="honors"
        :min-input-length="1"
        :item-projection="
          (item) => {
            return item.name;
          }
        "
        @select-item="selectItem"
      />
      <br>
      <button class="primary button">
        Add Honor to Pathfinder
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { usePathfinderStore } from "@/stores/pathfinders";
import { useHonorStore } from "@/stores/honors";

export default defineComponent({
  props: {
    pathfinderID: {
      type: String,
      required: true,
    },
  },
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
});
</script>

<style>
form {
  text-align: center;
  margin-bottom: var(--spaceHBelow);
}

form > button {
  display: inline;
}
</style>
