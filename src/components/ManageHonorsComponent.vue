<template>
  <h1>{{ pageHeader }}</h1>
  <div
    class="outline"
    style="text-align: center"
  >
    <span
      v-if="loading"
      class="loader"
    >Loading Honors</span>
    <h3>{{ honorsHeader }}</h3>
    <div v-if="selectionType === 'plan'">
      <HonorSearchComponent @search-result="updateHonorSearchResult" />
    </div>
    <div v-if="plannedHonors.length > 0">
      <HonorsDisplayComponent
        :selection-type="selectionType"
        :honor-search-result="displayedHonors"
        @toggle-selection="toggleSelection"
      />

      <h3>Selected Honors</h3>
      <SelectedHonorsDisplayComponent
        :selection-type="selectionType"
        @toggle-selection="toggleSelection"
      />
      <h3>Recipients</h3>
      <RecipientsDisplayComponent :selection-type="selectionType" />
    </div>

    <div class="content-box center-align">
      <button
        class="primary button"
        @click="addOrUpdateSelectedToClub()"
      >
        {{ buttonLabel }} ({{ selectedHonors.length }})
      </button>
      <p v-if="selectionType === 'plan'">
        This will add your selection of honors as a planned honor for every
        selected member in your club.
      </p>
      <p v-else>
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

import {
  defineComponent,
  ref,
  inject,
  computed,
  watchEffect,
  onMounted,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { addOrUpdateSelectedToClub } from "@/utils/manageHonors";
import { useSelectionStore, selectionType } from "@/stores/selectionStore";

export default defineComponent({
  components: {
    ToasterComponent,
    HonorSearchComponent,
    HonorsDisplayComponent,
    SelectedHonorsDisplayComponent,
    RecipientsDisplayComponent,
  },
  setup() {
    const route = useRoute();
    const selectionType = ref(route.params.selectionType);

    const usePathfinderStore = inject("usePathfinderStore");
    const useHonorStore = inject("useHonorStore");
    const selectionStore = useSelectionStore();

    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    honorStore.honors.length === 0 ? honorStore.getHonors() : undefined;
    pathfinderStore.pathfinders.length === 0
      ? pathfinderStore.getPathfinders()
      : undefined;

    const { honors, loading, error } = storeToRefs(honorStore);

    const plannedHonors = computed(() => {
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

    const earnedHonors = computed(() => {
      const earnedHonorIDs = pathfinderStore.pathfinders.flatMap(
        (pathfinder) =>
          pathfinder.pathfinderHonors
            .filter((honor) => honor.status === "Earned")
            .map((honor) => honor.honorID),
      );

      const uniqueEarnedHonorIDs = [...new Set(earnedHonorIDs)];

      return honorStore.honors.filter((honor) =>
        uniqueEarnedHonorIDs.includes(honor.honorID),
      );
    });

    const selectedHonors = computed(() =>
      honorStore.getHonorsBySelection(selectionType.value),
    );

    const recipients = computed(() =>
      pathfinderStore.getPathfindersBySelection(selectionType.value),
    );

    const bulkAdd = ref(false);

    function toggleSelection(honorID) {
      selectionStore.toggleSelection(selectionType.value, honorID, "honors");
      bulkAdd.value = false;
    }

    function isSelectedHonor(honorID: string) {
      return selectionStore.selections[selectionType.value].honors.includes(
        honorID,
      );
    }

    const honorSearchResult = ref([]);

    function updateHonorSearchResult(result) {
      honorSearchResult.value = result;
    }

    const displayedHonors = computed(() => {
      if (selectionType.value === "plan") {
        return honorSearchResult.value;
      } else if (selectionType.value === "earn") {
        return plannedHonors.value;
      } else if (selectionType.value === "award") {
      return earnedHonors.value;
    } else {
      return null;
    }
    });

    watch(
      () => route.params.selectionType,
      (newSelectionType) => {
        selectionType.value = newSelectionType;
      },
    );

    const pageHeader = computed(() => {
      switch (selectionType.value) {
        case "plan":
          return "Plan Honors";
        case "earn":
          return "Record Earned Honors";
        case "award":
          return "Award Honors";
        default:
          return "Manage Honors";
      }
    });

    const honorsHeader = computed(() => {
      switch (selectionType.value) {
        case "plan":
          return "Search for Honors";
        case "earn":
          return "Select Honors";
        case "award":
          return "Select Honors";
        default:
          return `Error ${selectionType.value}`;
      }
    });

    const buttonLabel = computed(() => {  
      switch(selectionType.value) {
        case "plan":
          return "Plan Honors";
        case "earn":
          return "Record Selected as Earned";
        case "award":
          return "Record Selected as Awarded";
      } 
    });

    return {
      honorStore,
      pathfinderStore,
      honors,
      selectedHonors,
      recipients,
      bulkAdd,
      getHonors: honorStore.getHonors,
      getHonorsByQuery: honorStore.getHonorsByQuery,
      addOrUpdateSelectedToClub: () =>
        addOrUpdateSelectedToClub(
          pathfinderStore,
          honorStore,
          selectionStore,
          recipients,
          selectedHonors,
          selectionType.value,
          bulkAdd,
        ),
      plannedHonors,
      loading,
      error,
      isSelectedHonor,
      toggleSelection,
      honorSearchResult,
      updateHonorSearchResult,
      displayedHonors,
      selectionType,
      pageHeader,
      honorsHeader,
      buttonLabel,
    };
  },
});
</script>
