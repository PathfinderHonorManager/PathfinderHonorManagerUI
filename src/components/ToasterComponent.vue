<template>
  <div id="toaster">
    <div class="power above-highlight">
      <h3>{{ message }}</h3>
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
    message: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
#toaster {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 0;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none;
  animation:
    0.5s ease 0s 1 both slideIn,
    2s ease 6s 1 forwards reverse slideIn;
}

@keyframes slideIn {
  0% {
    transform: translateY(100px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes pause {
  100% {
    transform: translateY(0px);
  }
}

h3 {
  margin: 0 0 0.25em 0;
}
</style>
