<template>
  <p v-if="error">Error!</p>
  <div v-if="pathfinders[0]" class="content-box">
    <span class="loader" v-if="loading">Loading Pathfinders</span>
    <DetailTableItemComponent
      v-for="(pathfinder, i) in pathfinders"
      :key="i"
      :header="pathfinder.firstName + ' ' + pathfinder.lastName"
    >
      <h3 v-if="pathfinder.className">
        {{ pathfinder.className }} (Grade {{ pathfinder.grade }})
      </h3>
      <h3 v-else>Staff</h3>

      <button
        v-if="!showing[i]"
        @click="showing[i] = true"
        class="plain"
        style="margin: 0"
      >
        Show {{ pathfinder.pathfinderHonors?.length }} Honors +
      </button>
      <button
        v-if="showing[i]"
        @click="showing[i] = false"
        class="plain"
        style="margin: 0"
      >
        Hide {{ pathfinder.pathfinderHonors?.length }} Honors -
      </button>

      <PostPathfinderHonorComponent
        v-if="showing[i]"
        :pathfinderID="pathfinder.pathfinderID"
      />

      <div class="content-box">
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
    </DetailTableItemComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";
import { useHonorStore } from "../stores/honors";
import DetailTableItemComponent from "./DetailTableItemComponent.vue";
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";

import { storeToRefs } from "pinia";
import { ref } from "vue";

export default defineComponent({
  components: {
    PostPathfinderHonorComponent,
    PathfinderHonorComponent,
    DetailTableItemComponent,
  },
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
      postPathfinder: (fn: string, ln: string, em: string, gr: number) =>
        pathfinderStore.postPathfinder(fn, ln, em, gr),
      getPathfinders: pathfinderStore.getPathfinders,
      honors,
      getHonors: honorStore.getHonors,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      showing: showing,
    };
  },
});
</script>
