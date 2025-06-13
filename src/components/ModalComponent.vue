<template>
  <div
    v-if="!closed"
    class="modal"
  >
    <div class="modal-content">
      <img
        src="~@/assets/close-icon.svg"
        class="close-button"
        @click="$emit('modal-closed')"
      >

      <h1>{{ header }}</h1>
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    header: {
      type: String,
      required: false,
      default: '',
    },
    closed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["modal-closed"],
  setup() {
    return;
  },
});
</script>

<style>
@import "@/assets/modals.css";
</style>
