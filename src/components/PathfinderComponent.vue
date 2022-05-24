<template>
  <p v-if="error">Error!</p>
  <div v-if="pathfinders[0]" class="power">
    <table>
      <tr v-for="(pathfinder, i) in pathfinders" :key="i">
        <h2>{{ pathfinder.firstName }} {{ pathfinder.lastName }}</h2>
        <br>
        <button v-if="!showing[i]" @click="showing[i] = true;" class="plain">Show Honors +</button>
        <button v-if="showing[i]" @click="showing[i] = false;" class="plain">Hide Honors -</button>
        <div v-if="showing[i]" class="honortable">
          <PostPathfinderHonorComponent :pathfinderID="pathfinder.pathfinderID"/>
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
        </div>
      </tr>
    </table>
  </div>
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

    pathfinderStore.getPathfinders();
    honorStore.getHonors();

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

<style>
  .honortable {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    grid-auto-rows: minmax(100px, auto);
  }
</style>
