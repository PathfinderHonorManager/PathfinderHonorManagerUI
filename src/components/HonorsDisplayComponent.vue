<template>
  <div v-if="honorSearchResult.length > 0">
    <div class="honortable">
      <div
        v-for="(honor, index) in honorSearchResult"
        :key="index"
        class="outline honor-item"
        :class="{ selected: isSelected(honor.honorID) }"
        @click="$emit('toggle-selection', honor.honorID)"
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
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    honorSearchResult: Array as PropType<Array<any>>,
    isSelected: Function as PropType<(honorID: number) => boolean>,
  },
  emits: ["toggle-selection"],
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
