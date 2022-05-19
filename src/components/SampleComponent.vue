<template>
  <p v-if="error">Error!</p>
  <button @click="getPathfinders">Get Pathfinders</button>
  <div v-if="pathfinders[0]" class="power">
    <table>
      <tr v-for="(pathfinder, i) in pathfinders" :key="i">
        <h2>{{ pathfinder.firstName }} {{ pathfinder.lastName }}</h2>
        <br>
        <button v-if="!showing[i]" @click="showing[i] = true;">Show Honors</button>
        <button v-if="showing[i]" @click="showing[i] = false;">Hide Honors</button>
        <tr v-if="showing[i]">
          <PathfinderHonorComponent
            v-for="pathfinderHonor in pathfinder.pathfinderHonors"
            :item="postPathfinderHonor"
            :key="pathfinderHonor.pathfinderHonorID"
            v-bind:pathfinderID="pathfinder.pathfinderID"
            v-bind:honorID="pathfinderHonor.honorID"
            v-bind:name="pathfinderHonor.name"
            v-bind:status="pathfinderHonor.status"
            v-bind:display="true"
          ></PathfinderHonorComponent>
        </tr>
        <PostPathfinderHonorComponent :pathfinderID="pathfinder.pathfinderID" />
      </tr>
    </table>
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



export default defineComponent({
  components: { PostPathfinderHonorComponent, PathfinderHonorComponent },
  setup() {
    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const { honors } = storeToRefs(honorStore);

    const displays = [];
    const showing = ref(displays);
    console.log(showing);

    return {
      loading,
      error,
      pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      honors,
      getHonors: honorStore.getHonors,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      showing: showing,
    };
  },
});
</script>
