<template>
  <div
    id="item-template"
    class="outline"
  >
    <div
      id="item-sidebar"
      class="power"
    />
    <div id="item-content">
      <slot>. . .</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
  },
  setup() {
    return;
  },
});
</script>

<style scoped>
#item-template {
  display: grid;
  grid-template-columns: 0.1fr 1.9fr;
  overflow: hidden;
  word-wrap: break-word;
  padding: 0;
}

#item-sidebar {
  margin: 0;
  border-right: var(--lightBorder);
  border-radius: 0;
  padding: var(--content-padding);
}

#item-content {
  padding: var(--content-padding);
}

h2 {
  margin: var(--itemMargin) 0;
}
</style>
