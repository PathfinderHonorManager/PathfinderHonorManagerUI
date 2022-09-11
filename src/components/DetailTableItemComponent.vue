<template>
  <div
    style="
      display: grid;
      grid-template-columns: 33% 66%;
      overflow: hidden;
      padding: 0;
    "
    class="outline"
  >
    <div
      class="power"
      style="margin: 0 var(--content-padding) 0 0; border-radius: 0"
    >
      <h2 style="margin: 0">
        {{ header }}
      </h2>
    </div>
    <div>
      <slot>. . .</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return;
  },
  props: {
    header: {
      type: String,
      required: true,
    },
  },
});
</script>
