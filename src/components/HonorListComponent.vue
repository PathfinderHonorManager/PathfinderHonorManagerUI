<template>
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
  <div v-if="selected.length > 0" style="margin-bottom: var(--spaceHBelow)">
    <h3>Selected Honors</h3>
    <div class="outline" style="display: flex">
      <button
        v-for="(honor, i) in selectedHonors"
        :key="i"
        class="secondary button"
        @click="toggleSelection(honor.honorID)"
        style="
          display: flex;
          flex-grow: 1;
          justify-content: space-between;
          align-items: center;
          --iconSize: 16px;
        "
      >
        <span>{{ honor.name }}</span>
        <span class="logobutton"><img src="@/assets/close-icon.svg" /></span>
      </button>
    </div>

    <h3>Recipients</h3>
    <div class="outline" style="display: flex">
      <button
        v-for="(recipient, i) in pathfinders"
        :key="i"
        class="button"
        :style="{
          backgroundColor: pathfinderStore.isSelected(recipient.pathfinderID)
            ? 'var(--blue)'
            : 'var(--secondaryColor)',
          flexGrow: 1,
        }"
        @click="toggleRecipientSelection(recipient.pathfinderID)"
      >
        {{ recipient.firstName }} {{ recipient.lastName }}
      </button>
    </div>
    <p>{{ recipients.length }} recipients selected</p>
    <p v-if="recipients.length == 1" class="note">
      When planning honors for individuals, we recommend doing it in the My Club
      page.
    </p>
  </div>

  <div class="content-box center-align">
    <button @click="addSelectedToClub" class="primary button">
      Plan Selected ({{ selected.length }})
    </button>
    <p class="note">
      This will add your selection of honors as a planned honor for every
      selected member in your club.
    </p>
  </div>

  <ToasterComponent
    v-if="bulkAdd"
    message="Your honors have been added to your club"
  />
</template>

<script lang="ts">
import ToasterComponent from "./ToasterComponent.vue";

import { defineComponent, ref, inject } from "vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  components: {
    ToasterComponent,
  },
  setup() {
    //use injected stores
    const usePathfinderStore = inject("usePathfinderStore");
    const useHonorStore = inject("useHonorStore");

    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    honorStore.honors.length === 0 ? honorStore.getHonors() : undefined;
    pathfinderStore.pathfinders.length === 0 ? pathfinderStore.getPathfinders() : undefined;


    let { honors, selected, loading, error } = storeToRefs(honorStore);
    const { pathfinders } = storeToRefs(pathfinderStore);

    let honorSearchResult = ref([]);
    let selectedHonors = ref(honorStore.getHonorsBySelection());

    let recipients = ref(pathfinderStore.getPathfindersBySelection());
    let bulkAdd = ref(false);

    function doHonorSearch(event) {
      selectedHonors.value = honorStore.getHonorsBySelection();
      honorSearchResult.value =
        event.target.value !== ""
          ? honorStore.getHonorsByQuery(event.target.value).splice(0, 15)
          : [];
    }

    function addSelectedToClub() {
      bulkAdd.value = true;
      pathfinderStore.bulkAddPathfinderHonors(
        recipients.value.map((p) => p.pathfinderID),
        selectedHonors.value.map((h) => h.honorID)
      );
      pathfinderStore.selected = [];
      honorStore.selected = [];
    }

    function toggleSelection(honorID) {
      honorStore.toggleSelection(honorID);
      selectedHonors.value = honorStore.getHonorsBySelection();
      bulkAdd.value = false;
    }

    function toggleRecipientSelection(pathfinderID) {
      pathfinderStore.toggleSelection(pathfinderID);
      recipients.value = pathfinderStore.getPathfindersBySelection();
      bulkAdd.value = false;
    }

    return {
      honorStore,
      pathfinderStore,
      honors,
      pathfinders,
      selectedHonors,
      recipients,
      bulkAdd,
      getHonors: honorStore.getHonors,
      getHonorsByQuery: honorStore.getHonorsByQuery,
      getHonorsBySelection: honorStore.getHonorsBySelection,
      addSelectedToClub: addSelectedToClub,
      honorSearchResult,
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
  background-image: url("~@/assets/close-icon.svg");
  background-size: 22.5px;
  background-repeat: no-repeat;
  background-position: -0.5125px -0.5125px;
}
</style>
