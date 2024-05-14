<template>
  <div
    id="item-template"
    class="outline"
  >
    <div
      id="item-sidebar"
      class="power"
    >
      <h2>
        {{ header }}
      </h2>
    </div>
    <div id="item-content">
      <slot>. . .</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    header: {
      type: String,
      required: true,
    },
  },
  setup() {
    return;
  },
});
</script>

<style scoped>
#item-template {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
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

@media screen and (max-width: 1080px) {
  #item-template {
    grid-template-rows: 150px auto;
    grid-template-columns: auto;
  }
  #item-sidebar {
    border-right: none;
    border-bottom: var(--lightBorder);
  }
}

#item-content {
  padding: var(--content-padding);
}

h2 {
  margin: var(--itemMargin) 0;
}
</style>
