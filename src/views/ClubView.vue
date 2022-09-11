<script setup lang="ts">
import { ref } from "vue";
import PathfinderComponent from "../components/PathfinderComponent.vue";
import ModalComponent from "../components/ModalComponent.vue";
</script>

<template>
  <h1>Eagles Club</h1>
  <div class="content-box" style="display: flex; justify-content: flex-end; padding-bottom: 0; margin-bottom: 0;">
    <button class="logobutton">+</button>
  </div>
  <PathfinderComponent />
</template>
