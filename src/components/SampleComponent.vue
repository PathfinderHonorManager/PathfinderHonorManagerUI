<template>
  <p>An example of how to integrate with the store!</p>
  <p v-if="error">Error</p>
  <button @click="getPathfinders">Get Pathfinders</button>
  <div class="power">
    <ul>
      <li v-for="pathfinder in pathfinders" :key="pathfinder.pathfinderID">
        <p>{{ pathfinder.firstName }} {{ pathfinder.lastName }}</p>
        <br>
        <button onclick="showing = true; console.log(showing);">Show Honors</button>
        <button onclick="showing = false; console.log(showing);">Hide Honors</button>
        <ul>
          <PathfinderHonorComponent
            v-for="pathfinderHonor in pathfinder.pathfinderHonors"
            :item="postPathfinderHonor"
            :key="pathfinderHonor.pathfinderHonorID"
            v-bind:pathfinderID="pathfinder.pathfinderID"
            v-bind:honorID="pathfinderHonor.honorID"
            v-bind:name="pathfinderHonor.name"
            v-bind:status="pathfinderHonor.status"
          ></PathfinderHonorComponent>
        </ul>
        <PostPathfinderHonorComponent :pathfinderID="pathfinder.pathfinderID" />
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
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";

import { storeToRefs } from "pinia";

import { ref } from "vue"
let showing = ref(false);

export default defineComponent({
  components: { PostPathfinderHonorComponent, PathfinderHonorComponent },
  setup() {
    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const { honors } = storeToRefs(honorStore);

    return {
      loading,
      error,
      pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      honors,
      getHonors: honorStore.getHonors,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
    };
  },
});
</script>

<style>
.hidden {
  display: none;
}

.showing {
  display: inline-block;
}
</style>
