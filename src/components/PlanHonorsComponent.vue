<template>
  <div class="outline" style="text-align: center">
    <h3>Find and Add Honors To Your Club</h3>

    <HonorSearchComponent @search-result="updateHonorSearchResult" />

    <span class="loader" v-if="loading">Loading Honors</span>
    <div v-if="honorSearchResult.length > 0">
      <h3>Search Results</h3>
      <HonorsDisplayComponent
        :honorSearchResult="honorSearchResult"
        @toggle-selection="toggleSelection"
      />

      <h3>Selected Honors</h3>
      <SelectedHonorsDisplayComponent
        @toggle-selection="toggleSelection"
        :selectionType="'plan'"
      />
      <h3>Recipients</h3>
      <RecipientsDisplayComponent
        :selectionType="'plan'"
      />
    </div>

    <div class="content-box center-align">
      <button @click="addOrUpdateSelectedToClub()" class="primary button">
        Plan Selected ({{ selectedHonors.length }})
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

<script lang="ts">
import ToasterComponent from "./ToasterComponent.vue";
import HonorSearchComponent from "./HonorSearchComponent.vue";
import HonorsDisplayComponent from "./HonorsDisplayComponent.vue";
import SelectedHonorsDisplayComponent from "./SelectedHonorsDisplayComponent.vue";
import RecipientsDisplayComponent from "./RecipientsDisplayComponent.vue";

import { defineComponent, ref, inject, computed } from "vue";
import { storeToRefs } from "pinia";
import { addOrUpdateSelectedToClub } from "@/utils/manageHonors";
import { useSelectionStore } from "@/stores/selectionStore"; // Added import for selectionStore

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
    const selectionStore = useSelectionStore();

    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    honorStore.honors.length === 0 ? honorStore.getHonors() : undefined;
    pathfinderStore.pathfinders.length === 0
      ? pathfinderStore.getPathfinders()
      : undefined;

    let { honors, selected, loading, error } = storeToRefs(honorStore);
    const { pathfinders } = storeToRefs(pathfinderStore);

    let honorSearchResult = ref([]);
    const selectedHonors = computed(() => honorStore.getHonorsBySelection("plan"));

    const recipients = computed(() => pathfinderStore.getPathfindersBySelection("plan"));
    let bulkAdd = ref(false);

    function toggleSelection(honorID) {
      selectionStore.toggleSelection('plan', honorID, 'honors'); 
      bulkAdd.value = false;
    }

    function handleSelectionChanged() {
      recipients.value = pathfinderStore.getPathfindersBySelection('plan')
    }

    function updateHonorSearchResult(result) {
      honorSearchResult.value = result;
    }

    function isSelectedHonor(honorID: string) {
      return selectionStore.selections[props.selectionType.value].honors.includes(honorID);
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
      addOrUpdateSelectedToClub: () =>
        addOrUpdateSelectedToClub(
          pathfinderStore,
          honorStore,
          selectionStore,
          recipients,
          selectedHonors,
          "plan",
          bulkAdd,
        ),
      honorSearchResult,
      updateHonorSearchResult: updateHonorSearchResult,
      loading,
      error,
      selected,
      isSelectedHonor,
      selectHonor: honorStore.selectHonor,
      toggleSelection: toggleSelection,
      handleSelectionChanged: handleSelectionChanged,
    };
  },
});
</script>
