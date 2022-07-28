<template>
  <span class="tooltip">
    {{ text }}
    {{ activateTooltip() }} <!--this might not be a legal move, but it works-->
  </span>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
export default defineComponent({
  setup() {
    function activateTooltip() {
      console.log("tooltip active");
      const parent = getCurrentInstance().parent.vnode.el;
      parent?.addEventListener("mouseover", (e: Event) => {
        e.target.querySelector(".tooltip").style.visibility = "visible";
      });
      parent?.addEventListener("mouseleave", (e: Event) => {
        e.target.querySelector(".tooltip").style.visibility = "hidden";
      });
    }

    return {
      activateTooltip,
    };
  },
  props: {
    text: {
      type: String,
      required: true,
    },
  },
});
</script>
