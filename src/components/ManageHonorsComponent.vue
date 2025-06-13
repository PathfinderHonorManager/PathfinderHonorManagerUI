<template>
  <div
    class="outline"
    style="text-align: center"
  >
    <span
      v-if="loading"
      class="loader"
    >Loading Honors</span>
    <div v-if="selectionType === 'plan'">
      <HonorSearchComponent @search-result="updateHonorSearchResult" />
    </div>
    <div v-if="plannedHonors.length > 0">
      <HonorsDisplayComponent
        :selection-type="selectionType"
        :honor-search-result="honorSearchResult"
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
import { useSelectionStore } from "@/stores/selectionStore";
import { useHonorStore } from "@/stores/honors";
import { usePathfinderStore } from "@/stores/pathfinders";
import { Pathfinder, PathfinderHonors, status } from "@/models/pathfinder";
import type { IHonor } from "@/stores/honors";

type SelectionType = 'plan' | 'earn' | 'award';

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
    let routeSelectionType = route.params.selectionType;
    let initialSelectionType: SelectionType = 'plan';
    if (typeof routeSelectionType === 'string' && ['plan', 'earn', 'award'].includes(routeSelectionType)) {
      initialSelectionType = routeSelectionType as SelectionType;
    } else if (Array.isArray(routeSelectionType) && routeSelectionType.length > 0 && ['plan', 'earn', 'award'].includes(routeSelectionType[0])) {
      initialSelectionType = routeSelectionType[0] as SelectionType;
    }
    const selectionType = ref<SelectionType>(initialSelectionType);

    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();
    const selectionStore = useSelectionStore();

    if (honorStore.honors.length === 0) {
      honorStore.getHonors();
    }
    if (pathfinderStore.pathfinders.length === 0) {
      pathfinderStore.getPathfinders();
    }

    const { honors, loading, error } = storeToRefs(honorStore);

    const plannedHonors = computed(() => {
      const plannedHonorIDs = pathfinderStore.pathfinders.flatMap(
        (pathfinder: Pathfinder) =>
          pathfinder.pathfinderHonors
            .filter((honor: PathfinderHonors) => honor.status === status.Planned)
            .map((honor: PathfinderHonors) => honor.honorID),
      );

      const uniquePlannedHonorIDs = [...new Set(plannedHonorIDs)];

      return honorStore.honors.filter((honor) =>
        uniquePlannedHonorIDs.includes(honor.honorID),
      );
    });

    const earnedHonors = computed(() => {
      const earnedHonorIDs = pathfinderStore.pathfinders.flatMap(
        (pathfinder: Pathfinder) =>
          pathfinder.pathfinderHonors
            .filter((honor: PathfinderHonors) => honor.status === status.Earned)
            .map((honor: PathfinderHonors) => honor.honorID),
      );

      const uniqueEarnedHonorIDs = [...new Set(earnedHonorIDs)];

      return honorStore.honors.filter((honor) =>
        uniqueEarnedHonorIDs.includes(honor.honorID),
      );
    });

    const selectedHonors = computed(() => {
      if (selectionType.value === 'plan' || selectionType.value === 'earn') {
        return honorStore.getHonorsBySelection(selectionType.value);
      }
      return [];
    });

    const recipients = computed(() => {
      if (selectionType.value === 'plan' || selectionType.value === 'earn') {
        return pathfinderStore.getPathfindersBySelection(selectionType.value);
      }
      return [];
    });

    const bulkAdd = ref(false);

    function toggleSelection(honorID: string) {
      if (['plan', 'earn', 'award'].includes(selectionType.value)) {
        selectionStore.toggleSelection(selectionType.value, honorID, "honors");
        bulkAdd.value = false;
      }
    }

    function isSelectedHonor(honorID: string) {
      if (['plan', 'earn', 'award'].includes(selectionType.value)) {
        return selectionStore.selections[selectionType.value].honors.includes(honorID);
      }
      return false;
    }

    const honorSearchResult = ref<IHonor[]>([]);

    function updateHonorSearchResult(result: IHonor[] | null | undefined) {
      honorSearchResult.value = Array.isArray(result) ? result : [];
    }

    const buttonLabel = computed(() => {
      switch(selectionType.value) {
        case "plan":
          return "Plan Honors";
        case "earn":
          return "Earn Honors";
        case "award":
          return "Award Honors";
        default:
          return "Manage Honors";
      }
    });

    async function addOrUpdateSelectedToClubWrapper() {
      if (['plan', 'earn', 'award'].includes(selectionType.value)) {
        await addOrUpdateSelectedToClub(
          pathfinderStore as any,
          honorStore as any,
          selectionStore,
          recipients,
          selectedHonors,
          selectionType.value,
          bulkAdd
        );
      }
    }

    return {
      selectionType,
      honors,
      error,
      honorSearchResult,
      updateHonorSearchResult,
      toggleSelection,
      isSelectedHonor,
      getHonors: honorStore.getHonors,
      getHonorsByQuery: honorStore.getHonorsByQuery,
      addOrUpdateSelectedToClub: addOrUpdateSelectedToClubWrapper,
      plannedHonors,
      loading,
      earnedHonors,
      selectedHonors,
      recipients,
      bulkAdd,
      buttonLabel,
    };
  },
});
</script>
