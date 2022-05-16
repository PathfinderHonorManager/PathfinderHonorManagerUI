<template>
  <table>
    <tr v-for="pathfinder in pathfinders" :key="pathfinder">
      <p>{{ pathfinder.firstName }}</p>
    </tr>
  </table>
</template>

<script>
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";

export default defineComponent({
  setup() {
    const store = usePathfinderStore();

    return {
      loading: store.loading,
      error: store.error,
      pathfinders: store.pathfinders,
      getPathfinders: store.getPathfinders,
    };
  },
  mounted() {
    if (this.pathfinders.length === 0) {
      this.getPathfinders();
    }
  },
});
</script>
