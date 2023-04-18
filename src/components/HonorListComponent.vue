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

  <div v-if="selected.length > 0" style="margin-bottom: var(--spaceHBelow);">
    <h3>Selected Honors</h3>
    <div class="honortable">
      <div
        v-for="(honor, i) in selectedHonors"
        :key="i"
        id="honortableitem"
        class="outline"
        @click="toggleSelection(honor.honorID)"
        :style="{
          borderColor: isSelected(honor.honorID)
            ? 'var(--blue)'
            : 'var(--outlineColor)',
        }"
      >
      <button v-if="isSelected(honor.honorID)" class="logobutton" style="border: none; background-color: var(--blue);"><img src="/close-icon.svg" /></button>
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

    <div class="content-box">
      <button style="font-size: 1.2em;">Plan it!</button>
      <p class="light">This will add your selection of honors as a planned honor for every member in your club.</p>
    </div>
    
  </div>

  <span class="loader" v-if="loading">Loading Honors</span>
  <div v-if="honorSearchResult.length > 0">
    <h3>Search Results</h3>
    <div class="honortable">
      <div
        v-for="(honor, i) in honorSearchResult"
        :key="i"
        id="honortableitem"
        class="outline"
        @click="toggleSelection(honor.honorID)"
        :style="{
          borderColor: isSelected(honor.honorID)
            ? 'var(--blue)'
            : 'var(--outlineColor)',
        }"
      >
      <button v-if="isSelected(honor.honorID)" class="logobutton" style="border: none; background-color: var(--blue);"><img src="/close-icon.svg" /></button>
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
    const { loading, error, selected } = storeToRefs(honorStore);
    const honors = honorStore.getHonors();

    let honorSearchResult = ref(honors);
    let selectedHonors = ref(honorStore.getHonorsBySelection());

    function doHonorSearch(event) {
      selectedHonors.value = honorStore.getHonorsBySelection();
      honorSearchResult.value =
        event.target.value !== ""
          ? honorStore.getHonorsByQuery(event.target.value).splice(0, 15)
          : [];
    }

    function toggleSelection(honorID) {
      honorStore.toggleSelection(honorID);
      selectedHonors.value = honorStore.getHonorsBySelection();
    }

    return {
      honors,
      selectedHonors,
      getHonors: honorStore.getHonors,
      getHonorsByQuery: honorStore.getHonorsByQuery,
      getHonorsBySelection: honorStore.getHonorsBySelection,
      honorSearchResult,
      doHonorSearch: doHonorSearch,
      loading,
      error,
      selected,
      isSelected: honorStore.isSelected,
      selectHonor: honorStore.selectHonor,
      toggleSelection: toggleSelection,
    };
  },
});
</script>

<style scoped>
#honortableitem {
  width: 100%;
  border-color: var(--outlineColor);
  margin: 0;
  height: auto;
  overflow: hidden;
  text-align: center;
  transition: 0.2s;
}

#honortableitem:hover {
  background-color: var(--outlineColor);
}

.selected {
  border-color: var(--blue);
}
</style>
