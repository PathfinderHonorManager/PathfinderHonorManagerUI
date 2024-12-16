<template>
  <div v-if="honorSearchResult.length > 0">
    <div class="honortable">
      <div
        v-for="(honor, index) in honorSearchResult"
        :key="index"
        class="outline honor-item"
        :class="{ selected: isSelectedHonor(honor.honorID) }"
        @click="$emit('toggle-selection', honor.honorID)"
      >
        <button v-if="isSelectedHonor(honor.honorID)" class="deselect-button">
          <img src="@/assets/close-icon.svg" />
        </button>
        <img
          :src="
            'https://images.pathfinderclub.tools/assets/honors/small/' +
            honor.patchFilename
          "
          class="patchimage"
        />
        <h3>{{ honor.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useSelectionStore } from "@/stores/selectionStore";

export default defineComponent({
  props: {
    selectionType: String as PropType<string>,
    honorSearchResult: Array as PropType<Array<any>>,
  },
  emits: ["toggle-selection"],
  setup(props, { emits }) {
    const selectionStore = useSelectionStore();
    function isSelectedHonor(honorID: string) {
      return selectionStore.selections[props.selectionType].honors.includes(
        honorID,
      );
    }
    return {
      isSelectedHonor,
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
