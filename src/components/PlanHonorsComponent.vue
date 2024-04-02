<template>
  <div class="outline" style="text-align: center">
    <h3>Find and Add Honors To Your Club</h3>

    <HonorSearchComponent @search-result="updateHonorSearchResult" />

    <span class="loader" v-if="loading">Loading Honors</span>
    <div v-if="honorSearchResult.length > 0">
      <h3>Search Results</h3>
      <HonorsDisplayComponent
        :honorSearchResult="honorSearchResult"
        :isSelected="isSelected"
        @toggle-selection="toggleSelection"
      />

      <h3>Selected Honors</h3>
      <SelectedHonorsDisplayComponent
        :selectedHonors="selectedHonors"
        @toggle-selection="toggleSelection"
      />
      <h3>Recipients</h3>
      <RecipientsDisplayComponent
        :pathfinders="pathfinders"
        :recipients="recipients"
        :pathfinderStore="pathfinderStore"
        :selectedHonors="selectedHonors"
        @selectionChanged="handleSelectionChanged"
      />
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
  </div>
</template>

<script>
import ToasterComponent from "./ToasterComponent.vue";
import HonorSearchComponent from "./HonorSearchComponent.vue";
import HonorsDisplayComponent from "./HonorsDisplayComponent.vue";
import SelectedHonorsDisplayComponent from "./SelectedHonorsDisplayComponent.vue";
import RecipientsDisplayComponent from "./RecipientsDisplayComponent.vue";

import { defineComponent, ref, inject } from "vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  components: {
    ToasterComponent,
    HonorSearchComponent,
    HonorsDisplayComponent,
    SelectedHonorsDisplayComponent,
    RecipientsDisplayComponent,
  },
  setup() {
    const usePathfinderStore = inject("usePathfinderStore");
    const useHonorStore = inject("useHonorStore");

    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    honorStore.honors.length === 0 ? honorStore.getHonors() : undefined;
    pathfinderStore.pathfinders.length === 0
      ? pathfinderStore.getPathfinders()
      : undefined;

    let { honors, selected, loading, error } = storeToRefs(honorStore);
    const { pathfinders } = storeToRefs(pathfinderStore);

    let honorSearchResult = ref([]);
    let selectedHonors = ref(honorStore.getHonorsBySelection());

    let recipients = ref(pathfinderStore.getPathfindersBySelection());
    let bulkAdd = ref(false);

    async function addSelectedToClub() {
      bulkAdd.value = true;
      const { successful, failed } =
        await pathfinderStore.bulkAddPathfinderHonors(
          recipients.value.map((p) => p.pathfinderID),
          selectedHonors.value.map((h) => h.honorID),
        );
      console.log(`${successful.length} honors were successfully added.`);
      console.log(`${failed.length} honors failed to add.`, failed);

      if (successful.length > 0) {
        pathfinderStore.selected = [];
        honorStore.selected = [];
        selectedHonors.value = [];
        recipients.value = [];
      }

      bulkAdd.value = false;
    }

    function toggleSelection(honorID) {
      honorStore.toggleSelection(honorID);
      selectedHonors.value = honorStore.getHonorsBySelection();
      bulkAdd.value = false;
    }

    function handleSelectionChanged() {
      recipients.value = pathfinderStore.getPathfindersBySelection();
    }

    function updateHonorSearchResult(result) {
      honorSearchResult.value = result;
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
      updateHonorSearchResult: updateHonorSearchResult,
      loading,
      error,
      selected,
      isSelected: honorStore.isSelected,
      selectHonor: honorStore.selectHonor,
      toggleSelection: toggleSelection,
      handleSelectionChanged: handleSelectionChanged,
    };
  },
});
</script>
