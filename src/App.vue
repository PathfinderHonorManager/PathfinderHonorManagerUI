<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import Authentication from "@/components/AuthenticationComponent.vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import UserProfileComponent from "./components/UserProfileComponent.vue";
import SidebarVersionInfo from "./components/SidebarVersionInfo.vue";
import { useUserStore } from "./stores/users";

const router = useRouter();
const { isAuthenticated, isLoading } = useAuth0();
const userStore = useUserStore();
const { getAccessTokenSilently } = useAuth0();
const authError = ref(false);

watchEffect(async () => {
  if (isLoading.value) return;

  try {
    if (isAuthenticated.value) {
      await userStore.decodeToken(getAccessTokenSilently);
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
  <div
    id="grid"
    :class="{ 'landing-layout': !isAuthenticated }"
  >
    <div
      v-if="isAuthenticated"
      id="sidebar"
    >
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
        :to="{ name: 'AchievementClasses' }"
      >
        Achievements
      </router-link>
      <router-link
        v-if="canUpdatePathfinder"
        :to="{ name: 'Investiture' }"
      >
        Investiture
      </router-link>
      
      <SidebarVersionInfo />
    </div>

    <div
      id="content"
      :class="{ 'landing-content': !isAuthenticated }"
    >
      <RouterView />
    </div>
  </div>
</template>

<style>
@import "@/assets/general.css";
</style>
