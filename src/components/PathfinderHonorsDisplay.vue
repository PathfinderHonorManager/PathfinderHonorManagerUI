<template>
  <div class="content-box">
    <div class="honors-grid">
      <PathfinderHonorComponent
        v-for="pathfinderHonor in pathfinderHonors"
        :key="pathfinderHonor.pathfinderHonorID"
        :pathfinderID="pathfinderId"
        :honorID="pathfinderHonor.honorID"
        :name="pathfinderHonor.name"
        :status="pathfinderHonor.status"
        :display="true"
        :image="pathfinderHonor.patchFilename"
        :canUpdatePathfinder="canUpdatePathfinder"
      >
      </PathfinderHonorComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";
import { onMounted } from 'vue';

const props = defineProps({
  pathfinderHonors: {
    type: Array,
    required: true
  },
  pathfinderId: {
    type: String,
    required: true
  },
  canUpdatePathfinder: {
    type: Boolean,
    default: false
  }
});

onMounted(() => {
  // Log the pathfinderHonors array to check the data structure
  if (props.pathfinderHonors && props.pathfinderHonors.length > 0) {
    console.log('First honor complete data:', JSON.stringify(props.pathfinderHonors[0], null, 2));
    console.log('patchFilename property in first honor:', props.pathfinderHonors[0].patchFilename);
    
    // Log all available honor properties
    console.log('Available properties on first honor:', 
      Object.keys(props.pathfinderHonors[0]).join(', '));
      
    // Count how many honors have patchFilename
    const pathCount = props.pathfinderHonors.filter(h => h.patchFilename).length;
    console.log(`${pathCount} out of ${props.pathfinderHonors.length} honors have patchFilename property`);
  }
});
</script>

<style scoped>
.content-box {
  padding: 10px;
  width: 100%;
}

.honors-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .honors-grid {
    justify-content: center;
  }
}
</style> 