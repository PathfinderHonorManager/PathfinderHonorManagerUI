<template>
  <div>
    <div
      v-if="selectedHonors.length > 0"
      class="outline selected-honors-container"
    >
      <button
        v-for="(honor, index) in selectedHonors"
        :key="index"
        class="secondary button"
        @click="$emit('toggle-selection', honor.honorID)"
      >
        <span>{{ honor.name }}</span>
        <span class="logobutton"><img src="@/assets/close-icon.svg" /></span>
      </button>
    </div>
    <div v-else class="outline note">No honors selected</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    selectedHonors: Array as PropType<Array<any>>,
  },
  emits: ["toggle-selection"],
});
</script>

<style scoped>
.selected-honors-container {
  display: flex;
  align-items: center;
  justify-content: stretch;
  flex-wrap: wrap;
  flex-grow: 1;
  --iconSize: 16px;
}

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
