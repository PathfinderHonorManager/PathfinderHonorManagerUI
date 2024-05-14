<template>
  <div>
    <div v-if="selectedHonors.length > 0" class="outline selection-container">
      <button
        v-for="(honor, index) in selectedHonors"
        :key="index"
        class="secondary button"
        @click="toggleHonorSelection(honor.honorID)"
      >
        <span>{{ honor.name }}</span>
        <span class="logobutton"><img src="@/assets/close-icon.svg" /></span>
      </button>
    </div>
    <div v-else class="outline note">No honors selected</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useSelectionStore } from "@/stores/selectionStore"; 
import { useHonorStore } from "@/stores/honors"; 

export default defineComponent({
  props: {
    selectionType: {
      type: String,
      required: true,
      validator: (value) => ["plan", "earn", "award"].includes(value),
    },
  },
  setup(props) {
    const selectionStore = useSelectionStore();
    const honorStore = useHonorStore();

    // Computed property to get selected honors based on the selection store
    const selectedHonors = computed(() => {
      const selectedHonorIDs =
        selectionStore.selections[props.selectionType].honors;
      return honorStore.honors.filter((honor) =>
        selectedHonorIDs.includes(honor.honorID),
      );
    });

    const toggleHonorSelection = (honorID: string) => {
      selectionStore.toggleSelection(props.selectionType, honorID, "honors");
    };

    return {
      selectedHonors,
      toggleHonorSelection,
    };
  },
});
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
}

.logobutton {
  width: var(--iconSize);
  height: var(--iconSize);
  margin-left: 15px;
}
</style>
