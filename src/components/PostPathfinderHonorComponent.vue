<template>
  <div class="content-box">
    <form
      class="honor-form"
      @submit.prevent="handleSubmit"
    >
      <div class="form-field">
        <vue3-simple-typeahead
          id="typeahead_id"
          ref="typeahead"
          placeholder="Search Honors"
          :items="honors"
          :min-input-length="1"
          :item-projection="
            (item: IHonor) => {
              return isHonorAlreadyAdded(item.honorID) ? `${item.name} (Already Added)` : item.name;
            }
          "
          :item-class="
            (item: IHonor) => {
              return isHonorAlreadyAdded(item.honorID) ? 'disabled-option' : '';
            }
          "
          :item-disabled="
            (item: IHonor) => {
              return isHonorAlreadyAdded(item.honorID);
            }
          "
          @select-item="selectItem"
        />
      </div>
      <button class="submit-button">
        Add Honor to Pathfinder
      </button>
    </form>
    <ToasterComponent
      v-if="showToast"
      :message="toastMessage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { usePathfinderStore } from "@/stores/pathfinders";
import { useHonorStore } from "@/stores/honors";
import ToasterComponent from "./ToasterComponent.vue";
import type { IHonor } from "@/stores/honors";
import api from "@/api/pathfinders";

export default defineComponent({
  components: {
    ToasterComponent
  },
  props: {
    pathfinderID: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();
    const postHonorID = ref("");
    const showToast = ref(false);
    const toastMessage = ref("");
    const typeahead = ref(null);

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const { honors } = storeToRefs(honorStore);

    const currentPathfinder = computed(() => {
      return pathfinders.value.find(p => p.pathfinderID === props.pathfinderID);
    });

    const existingHonorIds = computed(() => {
      if (!currentPathfinder.value) return new Set();
      return new Set(currentPathfinder.value.pathfinderHonors?.map(h => h.honorID) || []);
    });

    const isHonorAlreadyAdded = (honorId: string) => {
      return existingHonorIds.value.has(honorId);
    };

    const clearSearch = () => {
      if (typeahead.value) {
        const input = typeahead.value.$el.querySelector('input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input'));
        }
      }
    };

    const handleSubmit = async () => {
      try {
        const postData = {
          honorID: postHonorID.value,
          status: "Planned"
        };
        await api.postPathfinderHonor(props.pathfinderID, postData);
        toastMessage.value = "Honor successfully added";
        showToast.value = true;
        postHonorID.value = "";
        clearSearch();
        setTimeout(() => {
          showToast.value = false;
        }, 3000);
        await pathfinderStore.getPathfinderById(props.pathfinderID);
      } catch (err) {
        console.error("Failed to add honor:", err);
        toastMessage.value = "Failed to add honor";
        showToast.value = true;
        setTimeout(() => {
          showToast.value = false;
        }, 3000);
      }
    };

    return {
      loading,
      error,
      pathfinders,
      honors,
      getPathfinders: pathfinderStore.getPathfinders,
      postHonorID,
      showToast,
      toastMessage,
      handleSubmit,
      typeahead,
      isHonorAlreadyAdded
    };
  },
  methods: {
    selectItem(item: IHonor) {
      if (this.isHonorAlreadyAdded(item.honorID)) {
        return;
      }
      this.postHonorID = item.honorID;
    },
  },
});
</script>

<style scoped>
.honor-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin: 0;
}

.form-field {
  width: 100%;
  max-width: 400px;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color);
}

.vue3-simple-typeahead {
  width: 100%;
}

.vue3-simple-typeahead input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--lightGrey);
  border-radius: 6px;
  background-color: var(--grey);
  color: var(--color);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.vue3-simple-typeahead input:focus {
  outline: none;
  border-color: var(--actionColor);
}

.vue3-simple-typeahead .typeahead__list {
  background-color: var(--bgColor);
  border: 1px solid var(--lightGrey);
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.vue3-simple-typeahead .typeahead__item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.vue3-simple-typeahead .typeahead__item:hover {
  background-color: var(--grey);
}

.vue3-simple-typeahead .typeahead__item.active {
  background-color: var(--actionColor);
}

.submit-button {
  font-size: 1.25rem;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  border: none;
  background-color: var(--actionColor);
  color: var(--color);
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 200px;
  margin-top: 1rem;
}

.submit-button:hover {
  background-color: #2a4af0;
}

.submit-button:active {
  transform: translateY(1px);
}

.disabled-option {
  color: var(--noteColor);
  cursor: not-allowed;
  background-color: var(--grey);
}

.disabled-option:hover {
  background-color: var(--grey) !important;
}

@media screen and (max-width: 600px) {
  .honor-form {
    gap: 1.5rem;
  }
  
  .form-field {
    max-width: 100%;
  }
  
  .vue3-simple-typeahead input {
    padding: 0.875rem;
    font-size: 1rem;
  }
  
  .submit-button {
    font-size: 1.1rem;
    padding: 0.875rem 1.5rem;
    min-width: 180px;
  }
}

@media screen and (max-width: 480px) {
  .honor-form {
    gap: 1.25rem;
  }
  
  .form-field label {
    font-size: 0.95rem;
  }
  
  .vue3-simple-typeahead input {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
  
  .submit-button {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
    min-width: 160px;
  }
}
</style>
