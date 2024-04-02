<script setup lang="ts">
import { watchEffect } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import Authentication from "@/components/AuthenticationComponent.vue";
import RequestLoginModal from "./components/RequestLoginModal.vue";
import { RouterLink, RouterView } from "vue-router";
import UserProfileComponent from "./components/UserProfileComponent.vue";
import { useHonorStore } from "./stores/honors";
import { usePathfinderStore } from "./stores/pathfinders";
import { useUserStore } from "./stores/users";

const { isAuthenticated } = useAuth0();
const honorStore = useHonorStore();
const pathfinderStore = usePathfinderStore();
const userStore = useUserStore();
const { getAccessTokenSilently } = useAuth0();

watchEffect(async () => {
  try {
    if (isAuthenticated.value) {
      await userStore.decodeToken(getAccessTokenSilently);
      await honorStore.getHonors();
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <Authentication />
  <RequestLoginModal />
  <div id="grid">
    <div id="sidebar">
      <UserProfileComponent />
      <RouterLink to="/">My Club</RouterLink>
      <RouterLink to="/plan">Plan Honors</RouterLink>
      <RouterLink to="/earn">Record Earned Honors</RouterLink>
    </div>

    <div id="content">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import "@/assets/general.css";
</style>
