<script setup lang="ts">
import Authentication from "@/components/Authentication.vue";
import RequestLoginModal from "./components/RequestLoginModal.vue";
import { RouterLink, RouterView } from "vue-router";
import UserProfileComponent from "./components/UserProfileComponent.vue";
import ModalComponent from "./components/ModalComponent.vue";
import { usePathfinderStore } from "./stores/pathfinders";
import { useHonorStore } from "./stores/honors";

const pathfinder = usePathfinderStore();
const honors = useHonorStore();
</script>

<template>
  <Authentication />
  <RequestLoginModal />
  <header>
    <!--This will be used a some point-->
    <div class="wrapper"></div>
  </header>

  <aside id="menu">
    <UserProfileComponent />
    <RouterLink to="/" ref="homeLink">Home</RouterLink>
    <RouterLink to="/club">My Club</RouterLink>
    <RouterLink to="/honors">All Honors</RouterLink>
    <!-- <RouterLink to="/planner">Planner</RouterLink> -->
  </aside>

  <div class="maintext">
    <RouterView />
  </div>
</template>

<style>
@import "@/assets/general.css";
</style>
