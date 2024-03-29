<template>
  <div class="outline" style="text-align: center">
    <h3>Find and Add Honors To Your Club</h3>

    <input
      id="honorform"
      @keyup="doHonorSearch"
      type="text"
      placeholder="Search. . . "
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
            ? 'var(--actionColor)'
            : 'var(--lightGrey)',
        }"
      >
        <button v-if="isSelected(honor.honorID)" class="deselect-button">
          <img src="@/assets/close-icon.svg" />
        </button>
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
    <div class="outline" style="display: flex; flex-wrap: wrap">
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
          backgroundColor: pathfinderHasSelectedHonor(recipient.pathfinderID)
            ? 'var(--red)'
            : pathfinderStore.isSelected(recipient.pathfinderID)
              ? 'var(--actionColor)'
              : 'var(--lightGrey)',
          flexGrow: 1,
        }"
        @click="
          pathfinderHasSelectedHonor(recipient.pathfinderID)
            ? null
            : toggleRecipientSelection(recipient.pathfinderID)
        "
        :title="
          pathfinderHasSelectedHonor(recipient.pathfinderID)
            ? 'This pathfinder already has the selected honor'
            : ''
        "
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
    pathfinderStore.pathfinders.length === 0
      ? pathfinderStore.getPathfinders()
      : undefined;

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

    async function addSelectedToClub() {
      bulkAdd.value = true;
      const { successful, failed } =
        await pathfinderStore.bulkAddPathfinderHonors(
          recipients.value.map((p) => p.pathfinderID),
          selectedHonors.value.map((h) => h.honorID),
        );
      console.log(`${successful.length} honors were successfully added.`);
      console.log(`${failed.length} honors failed to add.`, failed);
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

    function pathfinderHasSelectedHonor(pathfinderID) {
      const pathfinder = pathfinders.value.find(
        (p) => p.pathfinderID === pathfinderID,
      );
      return pathfinder.pathfinderHonors.some((h) =>
        selected.value.includes(h.honorID),
      );
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
      pathfinderHasSelectedHonor: pathfinderHasSelectedHonor,
    };
  },
});
</script>

<style scoped>
#honortableitem {
  width: 100%;
  border-color: var(--lightBorder);
  margin: 0;
  height: auto;
  overflow: hidden;
  text-align: center;
  transition: 0.2s;
}

#honortableitem:hover {
  background-color: var(--grey);
}

.selected {
  border-color: var(--actionColor);
}

.deselect-button {
  display: flex;
  justify-self: start;
  align-self: left;
  font-size: 0.45em;
  background-color: var(--actionColor);
}
</style>
