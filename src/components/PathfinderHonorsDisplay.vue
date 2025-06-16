<template>
  <div class="content-box">
    <div class="honors-grid">
      <PathfinderHonorComponent
        v-for="pathfinderHonor in pathfinderHonors"
        :key="pathfinderHonor.pathfinderHonorID"
        :pathfinder-i-d="pathfinderId"
        :honor-i-d="pathfinderHonor.honorID"
        :name="pathfinderHonor.name"
        :status="pathfinderHonor.status"
        :display="true"
        :image="pathfinderHonor.patchFilename"
        :can-update-pathfinder="canUpdatePathfinder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";
import { onMounted } from 'vue';

interface PathfinderHonor {
  pathfinderHonorID: string;
  honorID: string;
  name: string;
  status: string;
  patchFilename?: string;
}

const props = defineProps({
  pathfinderHonors: {
    type: Array as () => PathfinderHonor[],
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
  box-sizing: border-box;
}

.honors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .honors-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 0 10px;
  }
}

@media (max-width: 480px) {
  .honors-grid {
    grid-template-columns: 1fr;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style> 