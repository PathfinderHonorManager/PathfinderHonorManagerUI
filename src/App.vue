<script setup lang="ts">
import Authentication from "@/components/Authentication.vue";
import RequestLoginModal from "./components/RequestLoginModal.vue";
import { RouterLink, RouterView } from "vue-router";
import UserProfileComponent from "./components/UserProfileComponent.vue"
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
