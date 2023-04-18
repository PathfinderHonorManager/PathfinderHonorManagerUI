<template>
  <div class="modal" v-if="!closed">
    <div class="modal-content">
      <img src="public\close-icon.svg" class="close-button" @click="$emit('modal-closed')" />

      <h1>{{ header }}</h1>
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["modal-closed"],
  setup() {
    return;
  },
  props: {
    header: {
      type: String,
      required: false,
    },
    closed: {
      type: Boolean,
      required: false,
    },
  },
});
</script>

<style>
@import "@/assets/modals.css";
</style>
