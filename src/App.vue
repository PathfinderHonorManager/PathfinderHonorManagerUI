<script setup lang="ts">
import Authentication from "@/components/Authentication.vue";
import { RouterLink, RouterView } from "vue-router";
import UserProfileComponent from "./components/UserProfileComponent.vue";
import { usePathfinderStore } from "./stores/pathfinders";
import { useHonorStore } from "./stores/honors";

const pathfinder = usePathfinderStore();
const honors = useHonorStore();
</script>

<template>
  <Authentication />
  <header>
    <div class="wrapper">
      <h1>Honor Manager</h1>
    </div>
  </header>

  <aside>
    <UserProfileComponent />
    <RouterLink to="/" ref="homeLink">Home</RouterLink>
    <RouterLink to="/club">My Club</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </aside>

  <div class="mainText">
    <RouterView />
  </div>
</template>

<style>
@import "@/assets/general.css";
</style>
