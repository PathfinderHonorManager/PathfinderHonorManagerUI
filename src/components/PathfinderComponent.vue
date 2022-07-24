<template>
  <p v-if="error">Error!</p>
  <div v-if="pathfinders[0]" class="outline">
    <div v-for="(pathfinder, i) in pathfinders" :key="i" class="power">
      <h2>{{ pathfinder.firstName }} {{ pathfinder.lastName }}</h2>
      <h3 v-if="pathfinder.className">{{ pathfinder.className }}  (Grade {{ pathfinder.grade}})</h3>
      <h3 v-else>Staff</h3>
      <button v-if="!showing[i]" @click="showing[i] = true" class="plain">
        Show Honors +
      </button>
      <button v-if="showing[i]" @click="showing[i] = false" class="plain">
        Hide Honors -
      </button>

      <PostPathfinderHonorComponent v-if="showing[i]" :pathfinderID="pathfinder.pathfinderID"/>
      
      <div v-if="showing[i]" class="honortable">
        <PathfinderHonorComponent
          v-for="pathfinderHonor in pathfinder.pathfinderHonors"
          :key="pathfinderHonor.pathfinderHonorID"
          :item="postPathfinderHonor"
          v-bind:pathfinderID="pathfinder.pathfinderID"
          v-bind:honorID="pathfinderHonor.honorID"
          v-bind:name="pathfinderHonor.name"
          v-bind:status="pathfinderHonor.status"
          v-bind:display="true"
          v-bind:image="pathfinderHonor.patchFilename"
        ></PathfinderHonorComponent>
      </div>
    </div>
  </div>
  <span class="loader" v-if="loading">Loading Pathfinders</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";
import { useHonorStore } from "../stores/honors";
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";

import { storeToRefs } from "pinia";
import { ref } from "vue";

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
