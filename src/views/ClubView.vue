<script setup lang="ts">
import { ref, onMounted } from "vue";
import PathfinderComponent from "../components/PathfinderComponent.vue";
import { useUserStore } from "../stores/users.ts";

const userStore = useUserStore(); // Initialize store
const clubName = ref("");

onMounted(async () => {
  clubName.value = userStore.clubName;
});
</script>

<template>
  <h1>{{ clubName }} Club</h1>
  <div class="content-box">
    <h3 class="title">Here, You Can View Your Club's Honors</h3>
    <p class="note">
      Individually expand pathfinders to view their honor statuses.
    </p>
  </div>

  <PathfinderComponent />
</template>
