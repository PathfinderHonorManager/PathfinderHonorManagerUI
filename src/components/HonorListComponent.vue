<template>
  <div v-if="selected.length > 0" style="margin-bottom: var(--spaceHBelow)">
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
            : 'var(--secondaryColor)',
        }"
      >
        <button
          v-if="isSelected(honor.honorID)"
          class="deselect-button"
        ></button>
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
    <h3>Recipients</h3>
    <div class="content-box">
      <button
        v-for="(recipient, i) in recipients"
        :key="i"
        class="primary button"
      >
        {{ recipient.firstName }} {{ recipient.lastName }}
      </button>
    </div>
  </div>
  <div class="outline" style="text-align: center">
    <h3>Find and Add Honors To Your Club</h3>

    <input
      id="honorform"
      @keyup="doHonorSearch"
      type="text"
      placeholder="Search. . . "
      style="background-color: var(--secondaryColor)"
    />
  </div>

  <div class="content-box right-align">
    <button @click="addSelectedToClub" class="primary button">
      Plan Selected ({{ selected.length }})
    </button>
    <p class="note">
      This will add your selection of honors as a planned honor for every member
      in your club.
    </p>
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
            : 'var(--secondaryColor)',
        }"
      >
        <button
          v-if="isSelected(honor.honorID)"
          class="deselect-button"
        ></button>
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
import { usePathfinderStore } from "../stores/pathfinders";
import { storeToRefs } from "pinia";

const pathfinderStore = usePathfinderStore();
const honorStore = useHonorStore();

const { loading, error, selected } = storeToRefs(honorStore);
const honors = honorStore.getHonors();

export default defineComponent({
  setup() {

    let honorSearchResult = ref(honors);
    let selectedHonors = ref(honorStore.getHonorsBySelection());

    pathfinderStore.selectAll();
    let recipients = ref(pathfinderStore.getPathfindersBySelection());

    function doHonorSearch(event) {
      selectedHonors.value = honorStore.getHonorsBySelection();
      honorSearchResult.value =
        event.target.value !== ""
          ? honorStore.getHonorsByQuery(event.target.value).splice(0, 15)
          : [];
    }

    function addSelectedToClub() {
      pathfinderStore.bulkAddPathfinderHonors(
        recipients.value,
        selectedHonors.value.map((h) => h.honorID)
      );
    }

    function toggleSelection(honorID) {
      honorStore.toggleSelection(honorID);
      selectedHonors.value = honorStore.getHonorsBySelection();
    }

    function toggleRecipientSelection(pathfinderID) {
      pathfinderStore.toggleSelection(pathfinderID);
      recipients.value = pathfinderStore.getPathfindersBySelection();
    }

    return {
      honors,
      selectedHonors,
      getHonors: honorStore.getHonors,
      getHonorsByQuery: honorStore.getHonorsByQuery,
      getHonorsBySelection: honorStore.getHonorsBySelection,
      addSelectedToClub: addSelectedToClub,
      honorSearchResult,
      recipients,
      doHonorSearch: doHonorSearch,
      loading,
      error,
      selected,
      isSelected: honorStore.isSelected,
      selectHonor: honorStore.selectHonor,
      toggleSelection: toggleSelection,
      toggleRecipientSelection: toggleRecipientSelection,
    };
  },
});
</script>

<style scoped>
#honortableitem {
  width: 100%;
  border-color: var(--secondaryColor);
  margin: 0;
  height: auto;
  overflow: hidden;
  text-align: center;
  transition: 0.2s;
}

#honortableitem:hover {
  background-color: var(--secondaryColor);
}

.selected {
  border-color: var(--blue);
}

.deselect-button {
  display: block;
  background-color: var(--blue);
  border: 2px solid var(--blue);
  padding: 0;
  margin: 0;
  height: 25px;
  width: 25px;
  background-image: url("public/close-icon.svg");
  background-size: 22.5px;
  background-repeat: no-repeat;
  background-position: -0.5125px -0.5125px;
}
</style>
