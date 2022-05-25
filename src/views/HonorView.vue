<template>
    <p>I'm honored to see you!</p>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

import { useHonorStore } from "../stores/honors";
const honorStore = useHonorStore();
honorStore.getHonors();
</script>
