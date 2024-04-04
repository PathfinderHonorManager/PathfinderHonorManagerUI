<template>
      <h1>{{ pageHeader }}</h1>
    <div class="outline" style="text-align: center">
      <span class="loader" v-if="loading">Loading Honors</span>
      <h3>{{ honorsHeader }}</h3>
      <div v-if="selectionType === 'plan'">
        <HonorSearchComponent @search-result="updateHonorSearchResult" />
      </div>
      <div v-if="plannedHonors.length > 0">
        <HonorsDisplayComponent
          :selectionType="selectionType"
          :honorSearchResult="displayedHonors"
          @toggle-selection="toggleSelection"
        />

        <h3>Selected Honors</h3>
        <SelectedHonorsDisplayComponent
          :selectionType="selectionType"
          @toggle-selection="toggleSelection"
        />
        <h3>Recipients</h3>
        <RecipientsDisplayComponent
          :selectionType="selectionType"
        />
      </div>

      <div class="content-box center-align">
        <button @click="addOrUpdateSelectedToClub()" class="primary button">
          {{ buttonLabel }} ({{ selectedHonors.length }})
        </button>
        <p v-if="selectionType === 'plan'">
          This will add your selection of honors as a planned honor for every selected member in your club.
        </p>
        <p v-else>
          This will update your selection of honors to earned for every selected member in your club.
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
  
  import { defineComponent, ref, inject, computed, watchEffect, onMounted, watch } from "vue";
  import { useRoute } from 'vue-router';
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
  
      let { honors, loading, error } = storeToRefs(honorStore);
  
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

      const selectedHonors = computed(() => honorStore.getHonorsBySelection(selectionType.value));

      const recipients = computed(() => pathfinderStore.getPathfindersBySelection(selectionType.value));

  
      let bulkAdd = ref(false);
  
      function toggleSelection(honorID) {
        selectionStore.toggleSelection(selectionType.value, honorID, "honors");
        bulkAdd.value = false;
      }
  
      function isSelectedHonor(honorID: string) {
        return selectionStore.selections[selectionType.value].honors.includes(honorID);
      }
  
      const honorSearchResult = ref([]);
  
      function updateHonorSearchResult(result) {
        honorSearchResult.value = result;
      }

      const displayedHonors = computed(() => {
      if (selectionType.value === 'plan') {
        return honorSearchResult.value;
      } else {
        return plannedHonors.value;
      }
    });

    // Watch for changes in route params and update selectionType accordingly
    watch(() => route.params.selectionType, (newSelectionType) => {
      selectionType.value = newSelectionType;
    });

    const pageHeader = computed(() => {
      return selectionType.value === 'plan' ? 'Plan Honors' : 'Record Earned Honors';
    });

    const honorsHeader = computed(() => {
      return selectionType.value === 'plan' ? 'Search for Honors' : 'All Planned Honors';
    });

    const buttonLabel = computed(() => {
      return selectionType.value === 'plan' ? 'Plan Honors' : 'Record Selected as Earned';
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
  