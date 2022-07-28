<template>
  <div class="outline" style="text-align: center">
    <h3>Find and add honors</h3>

    <input
      id="honorform"
      @keyup="doHonorSearch"
      type="text"
      placeholder="Search. . . "
      style="background-color: var(--outlineColor)"
    />
  </div>
  <span class="loader" v-if="loading">Loading Honors</span>
  <div v-if="honorSearchResult.length > 0">
    <div class="honortable">
      <div
        v-for="(honor, i) in honorSearchResult"
        :key="i"
        class="outline"
        style="
          width: 100%;
          margin: 0;
          height: auto;
          overflow: hidden;
          text-align: center;
        "
      >
        <img
          :src="
            'https://pathfinderhonor.azureedge.net/assets/small/' +
            honor.patchFilename
          "
          class="patchimage"
        />
        <h3>{{ honor.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useHonorStore } from "../stores/honors";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const honorStore = useHonorStore();
    const { loading } = storeToRefs(honorStore);
    const honors = honorStore.getHonors();

    let honorSearchResult = ref(honors);

    function doHonorSearch(event) {
      honorSearchResult.value = event.target.value !== ""? honorStore.getHonorsByQuery(event.target.value).splice(0, 15) : [];
    }

    return {
      honors, 
      getHonors: honorStore.getHonors,
      getHonorsByQuery: honorStore.getHonorsByQuery,
      honorSearchResult,
      doHonorSearch: doHonorSearch,
      loading,
    };
  },
});
</script>
