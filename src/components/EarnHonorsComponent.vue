<template>
  <div class="outline" style="text-align: center">
    <span class="loader" v-if="loading">Loading Honors</span>
    <div v-if="plannedHonors.length > 0">
      <h3>All Planned Honors</h3>
      <HonorsDisplayComponent
        :honorSearchResult="plannedHonors"
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
        :eligibilityCriteria="'earn'"
        @selectionChanged="handleSelectionChanged"
      />
    </div>

    <div class="content-box center-align">
      <button @click="addOrUpdateSelectedToClub()" class="primary button">
        Record Selected as Earned ({{ selectedForEarn.length }})
      </button>
      <p class="note">
        This will update your selection of honors to earned for every selected
        member in your club.
      </p>
    </div>

    <ToasterComponent
      v-if="bulkAdd"
      message="Your honors have been updated in your club"
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

    let { honors, selectedForEarn, loading, error } = storeToRefs(honorStore);
    const { pathfinders } = storeToRefs(pathfinderStore);

    let plannedHonors = computed(() => {
      const plannedHonorIDs = pathfinderStore.pathfinders.flatMap(
        (pathfinder) =>
          pathfinder.pathfinderHonors
            .filter((honor) => honor.status === "Planned")
            .map((honor) => honor.honorID),
      );

      const uniquePlannedHonorIDs = [...new Set(plannedHonorIDs)];

      return honorStore.honors.filter((honor) =>
        uniquePlannedHonorIDs.includes(honor.honorID),
      );
    });
    let selectedHonors = ref(honorStore.getHonorsBySelectionForEarn());

    let recipients = ref(pathfinderStore.getPathfindersBySelectionForEarn());
    let bulkAdd = ref(false);

    function toggleSelectionForEarn(honorID) {
      honorStore.toggleSelectionForEarn(honorID);
      selectedHonors.value = honorStore.getHonorsBySelectionForEarn();
      bulkAdd.value = false;
    }

    function handleSelectionChanged() {
      recipients.value = pathfinderStore.getPathfindersBySelectionForEarn();
    }

    function updateHonorSearchResult(result) {
      plannedHonors.value = result;
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
          recipients,
          selectedHonors,
          "earn",
          bulkAdd,
        ),
      plannedHonors,
      updateHonorSearchResult: updateHonorSearchResult,
      loading,
      error,
      selectedForEarn,
      isSelected: honorStore.isSelectedForEarn,
      selectHonor: honorStore.selectHonor,
      toggleSelection: toggleSelectionForEarn,
      handleSelectionChanged: handleSelectionChanged,
    };
  },
});
</script>
