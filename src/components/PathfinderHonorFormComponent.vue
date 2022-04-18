<template>
  <form @submit.prevent="postPathfinderHonor(pathfinderID, postHonorID)">
    <div class="form-group">
      <label for="pathfinderHonorID">HonorID</label>
      <input
        type="text"
        class="form-control"
        id="honorID"
        v-model="postHonorID"
      />
    </div>
    <button>Post New Honor</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { usePathfinderStore } from "../stores/pathfinders";

export default defineComponent({
  setup() {
    const pathfinderStore = usePathfinderStore();
    const postHonorID = "";

    return {
      loading: pathfinderStore.loading,
      error: pathfinderStore.error,
      pathfinders: pathfinderStore.pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      postHonorID,
    };
  },
  props: {
    pathfinderID: {
      type: String,
      required: true,
    },
  },
});
</script>
