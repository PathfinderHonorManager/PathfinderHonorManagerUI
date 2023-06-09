<script setup lang="ts">
import { watchEffect } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import Authentication from "@/components/AuthenticationComponent.vue";
import RequestLoginModal from "./components/RequestLoginModal.vue";
import { RouterLink, RouterView } from "vue-router";
import UserProfileComponent from "./components/UserProfileComponent.vue";
import { useHonorStore } from "./stores/honors";
import { usePathfinderStore } from "./stores/pathfinders";

const { isAuthenticated } = useAuth0();
const honorStore = useHonorStore();
const pathfinderStore = usePathfinderStore();

watchEffect(async () => {
  if (isAuthenticated.value) {
    // User is authenticated, perform API request
    await honorStore.getHonors();
    await pathfinderStore.getPathfinders();
  }
});
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
    <RouterLink to="/">My Club</RouterLink>
    <RouterLink to="/honors">Plan Honors</RouterLink>
  </aside>

  <div class="maintext">
    <RouterView />
  </div>
</template>

<style>
@import "@/assets/general.css";
</style>
