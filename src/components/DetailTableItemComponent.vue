<template>
  <div id="item-template" class="outline">
    <div class="power" id="item-sidebar">
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

<style scoped>
#item-template {
  display: grid;
  grid-template-columns: 25vw auto;
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
