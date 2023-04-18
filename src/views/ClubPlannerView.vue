<script setup lang="ts">
import { storeToRefs } from "pinia";
import SelectedHonorsComponent from "../components/SelectedHonorsComponent.vue";
import { usePathfinderStore } from "../stores/pathfinders";
import { useHonorStore } from "../stores/honors";

const pathfinderStore = usePathfinderStore();
const honorStore = useHonorStore();
const { pathfinders } = storeToRefs(pathfinderStore);
const { honors } = storeToRefs(honorStore);
</script>

<template>
  <SelectedHonorsComponent></SelectedHonorsComponent>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import honors from "@/api/honors";

export default defineComponent({
  components: {
    SelectedHonorsComponent,
  },
  setup() {
    return;
  },
});
</script>
