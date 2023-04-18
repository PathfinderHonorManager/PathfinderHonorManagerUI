<template>
  <div class="outline">
    <h2>Selected Honors</h2>
    <div class="items">
      <td v-for="(honor, i) in selected" :key="i">
        <div class="content-box">
          <div class="outline">
            <img
              :src="
                'https://pathfinderhonor.azureedge.net/assets/small/' +
                honor.patchFilename
              "
              class="patchimage"
            />
            <h3>{{ honor.name }}</h3>
          </div>
        </div>
      </td>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DetailTableItemComponent from "../components/DetailTableItemComponent.vue";
import { storeToRefs } from "pinia";
import { useHonorStore } from "../stores/honors";

export default defineComponent({
  components: {
    DetailTableItemComponent,
  },
  setup() {
    const honorStore = useHonorStore();
    const { loading, error, selected } = storeToRefs(honorStore);
    return {
      loading,
      error,
      selected,
    };
  },
});
</script>

<style scoped>
@import "/src/assets/general.css";

.items {
  display: grid;
  gap: 0;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(2, 1fr);
}
</style>
