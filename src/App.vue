<script setup lang="ts">
import Authentication from "@/components/Authentication.vue";
import { RouterLink, RouterView } from "vue-router";
import { ManagerIntro } from "@/components/ManagerIntro.vue";
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { usePathfinderStore } from "@/stores/pathfinders";
import { useHonorStore } from "@/stores/honors";

const pathfinder = usePathfinderStore();
const honors = useHonorStore();
const { firstName, lastName } = storeToRefs(pathfinder);
const { singleFocus, groupFocus } = storeToRefs(honors);
</script>

<template>
  <Authentication />
  <header>
    <div class="wrapper">
      <h1>Honor Manager</h1>
    </div>
  </header>

  <aside>
    <RouterLink to="/" ref="homeLink">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </aside>

  <div class="mainText">
    <RouterView />
  </div>
</template>

<style>
@import "@/assets/general.css";
</style>
