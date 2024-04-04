<template>
  <div class="outline" style="text-align: center">
    <span class="loader" v-if="loading">Loading Honors</span>
    <div v-if="plannedHonors.length > 0">
      <h3>All Planned Honors</h3>
      <HonorsDisplayComponent
        :honorSearchResult="plannedHonors"
        @toggle-selection="toggleSelection"
      />

      <h3>Selected Honors</h3>
      <SelectedHonorsDisplayComponent
        :selectionType="'earn'"
        @toggle-selection="toggleSelection"
      />
      <h3>Recipients</h3>
      <RecipientsDisplayComponent
        :selectionType="'earn'"
      />
    </div>

    <div class="content-box center-align">
      <button @click="addOrUpdateSelectedToClub()" class="primary button">
        Record Selected as Earned ({{ selectedHonors.length }})
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

import { defineComponent, ref, inject, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { addOrUpdateSelectedToClub } from "@/utils/manageHonors";
import { useSelectionStore } from "@/stores/selectionStore";

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

    let { honors, loading, error } = storeToRefs(honorStore);
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
    const selectedHonors = computed(() => honorStore.getHonorsBySelection("earn"));

    const recipients = computed(() => pathfinderStore.getPathfindersBySelection("earn"));

    let bulkAdd = ref(false);

    function toggleSelectionForEarn(honorID) {
      selectionStore.toggleSelection("earn", honorID, "honors");
      bulkAdd.value = false;
    }

    function isSelectedHonor(honorID: string) {
      return selectionStore.selections.earn.honors.includes(honorID);
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
          "earn",
          bulkAdd,
        ),
      plannedHonors,
      loading,
      error,
      isSelectedHonor,
      toggleSelection: toggleSelectionForEarn,
    };
  },
});
</script>
