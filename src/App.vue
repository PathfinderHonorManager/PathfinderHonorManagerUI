<script setup lang="ts">
import { computed, watchEffect, ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import Authentication from "@/components/AuthenticationComponent.vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import UserProfileComponent from "./components/UserProfileComponent.vue";
import { useHonorStore } from "./stores/honors";
import { usePathfinderStore } from "./stores/pathfinders";
import { useUserStore } from "./stores/users";

const router = useRouter();
const { isAuthenticated, isLoading } = useAuth0();
const honorStore = useHonorStore();
const pathfinderStore = usePathfinderStore();
const userStore = useUserStore();
const { getAccessTokenSilently } = useAuth0();
const authError = ref(false);

watchEffect(async () => {
  if (isLoading.value) return;

  try {
    if (isAuthenticated.value) {
      await userStore.decodeToken(getAccessTokenSilently);
      await honorStore.getHonors();
      // If we're on the landing page, redirect to club
      if (router.currentRoute.value.name === 'landing') {
        router.push({ name: 'club' });
      }
    } else {
      // If not authenticated and not on landing page, redirect
      if (router.currentRoute.value.name !== 'landing') {
        router.push({ name: 'landing' });
      }
    }
  } catch (error) {
    console.error("Auth error:", error);
    authError.value = true;
  }
});

const canUpdatePathfinder = computed(() =>
  isAuthenticated.value && userStore.permissions.includes("update:pathfinders")
);
</script>

<template>
  <Authentication />
  <div id="grid" :class="{ 'landing-layout': !isAuthenticated }">
    <div id="sidebar" v-if="isAuthenticated">
      <UserProfileComponent />
      <RouterLink :to="{ name: 'club' }">
        My Club
      </RouterLink>
      <router-link
        v-if="canUpdatePathfinder"
        :to="{ name: 'ManageHonors', params: { selectionType: 'plan' } }"
      >
        Plan Honors
      </router-link>
      <router-link
        v-if="canUpdatePathfinder"
        :to="{ name: 'ManageHonors', params: { selectionType: 'earn' } }"
      >
        Record Earned Honors
      </router-link>
      <router-link
        v-if="canUpdatePathfinder"
        :to="{ name: 'ManageHonors', params: { selectionType: 'award' } }"
      >
        Award Honors
      </router-link>
      <router-link
        v-if="canUpdatePathfinder"
        :to="{ name: 'Investiture' }"
      >
        Investiture
      </router-link>
    </div>

    <div id="content" :class="{ 'landing-content': !isAuthenticated }">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import "@/assets/general.css";
</style>
