<template>
  <div class="content-box">
    <form @submit.prevent="handleSubmit">
      <vue3-simple-typeahead
        ref="typeahead"
        id="typeahead_id"
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
      <br>
      <button class="primary button">
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

<style>
form {
  text-align: center;
  margin-bottom: var(--spaceHBelow);
}

form > button {
  display: inline;
}

.disabled-option {
  color: var(--grey);
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.disabled-option:hover {
  background-color: #f5f5f5 !important;
}
</style>
