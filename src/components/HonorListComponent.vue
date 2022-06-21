<template>
  <!--work in progress-->
  <div v-if="false" class="outline" style="text-align: center">
    <h3>Find and add honors</h3>

    <input
      id="honorform"
      v-on:keyup="searchResult = getHonorsByQuery('abs')"
      type="text"
      placeholder="Search. . . "
      style="background-color: var(--outlineColor)"
    />
    <li v-for="(honor, i) in searchResult" :key="i">
      <p>add {{ honor }}</p>
    </li>
  </div>
  <div class="outline">
    <div class="honortable">
      <div
        v-for="(honor, i) in honors"
        :key="i"
        class="outline"
        style="
          width: 100%;
          margin: 0;
          height: auto;
          overflow: hidden;
          text-align: center;
        "
      >
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useHonorStore } from "../stores/honors";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const honorStore = useHonorStore();
    honorStore.getHonors();
    const { honors, getHonorsByQuery } = storeToRefs(honorStore);

    const searchResult = ref("");

    const doNotLookMsgs = [
      "Why are you looking?",
      "This is still work in progress!",
      "Look away!",
      "Help me understand, please. Why are you looking?",
      "There are plenty of other distractions for you to look at!",
      "Really, now. You're making us look unproffesional. Click another nav link!",
      "You don't have to do this!",
    ];
    return {
      honors,
      getHonorsByQuery,
      searchResult,
      doNotLookMsgs,
    };
  },
});
</script>
