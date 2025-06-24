<template>
  <h1 v-if="isLoadingClub">Loading Club...</h1>
  <h1 v-else-if="clubName">{{ clubName }} Club</h1>
  <h1 v-else>Club</h1>
  <div class="content-box">
    <h3 class="title">
      Here, You Can View Your Club's Honors
    </h3>
    <p class="note">
      Individually expand pathfinders to view their honor statuses.
    </p>
  </div>
  <PathfinderComponent />
</template>

<script lang="ts">
import { computed } from "vue";
import PathfinderComponent from "../components/PathfinderComponent.vue";
import { useUserStore } from "../stores/users";

export default {
  components: { PathfinderComponent },
  setup() {
    const userStore = useUserStore();
    const clubName = computed(() => userStore.clubName);
    const isLoadingClub = computed(() => userStore.isLoadingClub);
    return { clubName, isLoadingClub };
  }
};
</script>
