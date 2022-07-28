<template>
  <span class="tooltip">
    {{ text }}
  </span>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
export default defineComponent({
  setup() {  
    let parent = getCurrentInstance().parent.vnode.el;
    parent?.addEventListener("mouseover", (e: Event) => {
      e.target.querySelector(".tooltip").style.visibility = "visible";
    });
    parent?.addEventListener("mouseleave", (e: Event) => {
      e.target.querySelector(".tooltip").style.visibility = "hidden";
    });
  },
  props: {
    text: {
      type: String,
      required: true,
    },
  },
});
</script>
