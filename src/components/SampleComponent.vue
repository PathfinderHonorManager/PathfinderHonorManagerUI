<template>
  <p>An example of how to integrate with the store!</p>
  <p v-if="loading">Loading</p>
  <p v-if="error">Error</p>
  <button @click="getPathfinders">Get Pathfinders</button>
  <ul>
    <li v-for="(pathfinder, i) in pathfinders" :key="i">
      <p>{{ pathfinder.firstName }} {{ pathfinder.lastName }}</p>
        <ul>
          <li v-for="(pathfinderHonor, i) in pathfinder.pathfinderHonors" :key="i">
          <p>{{ pathfinderHonor.name }} -- {{ pathfinderHonor.status }} </p>
          </li>
        </ul> 
    </li>
  </ul>
  <button @click="getHonors">Get Honors</button>
  <ul>
  <li v-for="(honor, i) in honors" :key="i">
      <p>{{ honor.name }}</p>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";
import { useHonorStore } from "../stores/honors";

export default defineComponent({
  setup() {
    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    return {
      loading: pathfinderStore.loading,
      error: pathfinderStore.error,
      pathfinders: pathfinderStore.pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      honors: honorStore.honors,
      getHonors: honorStore.getHonors,
    };
  },
});
</script>
