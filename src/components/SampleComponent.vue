<template>
  <p>An example of how to integrate with the store!</p>
  <p v-if="loading">Loading</p>
  <p v-if="error">Error</p>
  <button @click="getPathfinders"></button>
  <ul>
    <li v-for="(pathfinder, i) in pathfinders" :key="i">
      <p>{{ pathfinder.firstName }} {{ pathfinder.lastName }}</p>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";

export default defineComponent({
  setup() {
    const store = usePathfinderStore();

    return {
      // there's a way to destructure this, but this is more explicit and clear.
      // these returned items are available in the template.
      loading: store.loading,
      error: store.error,
      pathfinders: store.pathfinders,
      getPathfinders: store.getPathfinders,
    };
  },
});
</script>