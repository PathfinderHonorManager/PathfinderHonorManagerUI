<template>
  <p>An example of how to integrate with the store!</p>
  <p v-if="error">Error</p>
  <button @click="getPathfinders">Get Pathfinders</button>
  <div v-if="loading">
    <p>Loading</p>
  </div>
  <div v-else>
    <ul>
      <li v-for="pathfinder in pathfinders" :key="pathfinder.pathfinderID">
        <p>{{ pathfinder.firstName }} {{ pathfinder.lastName }}</p>
        <ul>
          <li
            v-for="pathfinderHonor in pathfinder.pathfinderHonors"
            :key="pathfinderHonor.pathfinderHonorID"
          >
            <p>
              {{ pathfinderHonor.name }} -- {{ pathfinderHonor.status }}
              {{ pathfinderHonor.pathfinderHonorID }}
            </p>
          </li>
        </ul>
        <PathfinderHonorFormComponent :pathfinderID="pathfinder.pathfinderID" />
      </li>
    </ul>
  </div>
  <button @click="getHonors">Get Honors</button>
  <ul>
    <li v-for="(honor, i) in honors" :key="i">
      <p>{{ honor.name }} {{ honor.honorID }}</p>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";
import { useHonorStore } from "../stores/honors";
import PathfinderHonorFormComponent from "./PathfinderHonorFormComponent.vue";

export default defineComponent({
  components: { PathfinderHonorFormComponent },
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
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
    };
  },
});
</script>
