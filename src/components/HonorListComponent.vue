<template>
  <h2>This page is still a work in progress! Look away and spare yourself!</h2>
  <div v-for="(honor, i) in honors" :key="i" class="power">
    <div class="power">
      <img 
        :src="'https://pathfinderhonor.azureedge.net/assets/small/' + honor.patchFilename"
        class="patchimage"
      />
      <p>{{ doNotLookMsgs[Math.floor(Math.random() * doNotLookMsgs.length)] }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useHonorStore } from "../stores/honors";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const honorStore = useHonorStore();
    honorStore.getHonors();
    const { honors } = storeToRefs(honorStore);

    const doNotLookMsgs = ["Why are you looking?", "This is still work in progress!", "Look away!", "Help me understand, please. Why are you looking?", "There are plenty of other distractions for you to look at!", "Really, now. You're making us look unproffesional. Click another nav link!", "You don't have to do this!"];
    return {
      honors,
      doNotLookMsgs,
    }
  },
});
</script>
