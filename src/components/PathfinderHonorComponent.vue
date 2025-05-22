<template>
  <div class="honor-card" v-if="display">
    <div class="honor-content">
      <div class="honor-image">
        <img
          :src="getImageUrl"
          class="patch-image"
          @error="handleImageError"
          alt="Honor patch"
        />
      </div>
      <h3 class="honor-name">{{ name }}</h3>
      
      <div class="status-dropdown">
        <div class="status-selector" @click="showDropdown = !showDropdown" :class="newStatus.toLowerCase()">
          <span>{{ newStatus }}</span>
          <span class="dropdown-arrow">▼</span>
        </div>
        
        <div class="dropdown-options" v-if="showDropdown">
          <div 
            class="dropdown-option planned" 
            @click="selectStatus('Planned')"
          >
            Planned
          </div>
          <div 
            class="dropdown-option earned" 
            @click="selectStatus('Earned')"
          >
            Earned
          </div>
          <div 
            class="dropdown-option awarded" 
            @click="selectStatus('Awarded')"
          >
            Awarded
          </div>
        </div>
      </div>
      
      <button 
        class="update-button"
        v-if="canUpdatePathfinder"
        @click.prevent="putPathfinderHonor(pathfinderID, honorID, newStatus)"
        :disabled="!canEdit"
      >
        Update Status
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePathfinderStore } from "@/stores/pathfinders";

export default defineComponent({
  setup(props) {
    const pathfinderStore = usePathfinderStore();
    if (!pathfinderStore) {
      throw new Error("PathfinderStore is not provided");
    }

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const newStatus = ref(props.status);
    const showDropdown = ref(false);
    const hasImageError = ref(false);

    onMounted(() => {
      console.log(`Honor ${props.name} patchFilename:`, props.image);
    });

    const getImageUrl = computed(() => {
      if (!props.image) {
        console.log(`No patchFilename for honor ${props.name}, using default`);
        return 'https://via.placeholder.com/70?text=Honor';
      }
      
      // Always use the full URL to the actual image
      return `https://images.pathfinderclub.tools/assets/honors/small/${props.image}`;
    });

    const canEdit = computed(() => {
      return props.canUpdatePathfinder && newStatus.value !== props.status;
    });

    const selectStatus = (status) => {
      newStatus.value = status;
      showDropdown.value = false;
    };

    const handleImageError = (e) => {
      console.error(`Image failed to load for honor ${props.name}:`, props.image);
      hasImageError.value = true;
      e.target.src = 'https://via.placeholder.com/70?text=Honor';
    };

    return {
      loading,
      error,
      pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      putPathfinderHonor: pathfinderStore.putPathfinderHonor,
      newStatus,
      canEdit,
      showDropdown,
      selectStatus,
      handleImageError,
      hasImageError,
      getImageUrl
    };
  },
  props: {
    pathfinderID: {
      type: String,
      required: true,
    },
    honorID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    display: {
      type: Boolean,
      required: false,
      default: true
    },
    image: {
      type: String,
      required: false,
    },
    canUpdatePathfinder: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style scoped>
.honor-card {
  width: 220px;
  background-color: #151b2b;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.honor-card:hover {
  transform: translateY(-5px);
}

.honor-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.honor-image {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.patch-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.honor-name {
  text-align: center;
  font-size: 1.2rem;
  margin: 0;
  color: white;
  font-weight: 600;
}

.status-dropdown {
  position: relative;
  width: 100%;
}

.status-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 0.8rem;
  transition: transform 0.3s;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1f273a;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dropdown-option {
  padding: 8px 15px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  transition: background-color 0.2s;
}

.dropdown-option:hover {
  filter: brightness(1.1);
}

.update-button {
  width: 100%;
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.update-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

.update-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Status colors */
.planned {
  background-color: #6c757d;
}

.earned {
  background-color: #f4863d;
}

.awarded {
  background-color: #57b874;
}
</style>
