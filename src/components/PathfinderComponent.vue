<template>
  <PathfinderList
    :pathfinders="pathfinders"
    :loading="loading"
    :error="error"
    :error-message="errorMessage"
    :can-create-pathfinder="canCreatePathfinder"
    :can-update-pathfinder="canUpdatePathfinder"
    @create-pathfinder="creatingPathfinder = true"
    @edit-pathfinder="openEditModal"
    @retry-loading="retryLoading"
  />

  <ModalComponent
    header="Add a Pathfinder!"
    :closed="!creatingPathfinder"
    @modal-closed="creatingPathfinder = false"
  >
    <CreatePathfinderForm @submit="submitAddForm" />
  </ModalComponent>

  <ModalComponent
    header="Edit a Pathfinder!"
    :closed="!isEditModalOpen"
    @modal-closed="isEditModalOpen = false"
  >
    <EditPathfinderComponent
      :pathfinder="selectedPathfinder"
      @edit-success="handleEditSuccess"
      @edit-failure="handleEditFailure"
    />
  </ModalComponent>
  
  <ToasterComponent
    v-if="showToaster"
    :message="toasterMessage"
    @hide="showToaster = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PathfinderList from "./PathfinderList.vue";
import ModalComponent from "./ModalComponent.vue";
import EditPathfinderComponent from "./EditPathfinderComponent.vue";
import ToasterComponent from "./ToasterComponent.vue";
import CreatePathfinderForm from "./CreatePathfinderForm.vue";
import { storeToRefs } from "pinia";
import { usePathfinderStore } from "@/stores/pathfinders";
import { useHonorStore } from "@/stores/honors";
import { useUserStore } from "@/stores/users";
import { PathfinderPost } from "@/models/pathfinder";

const pathfinderStore = usePathfinderStore();
const honorStore = useHonorStore();
const userStore = useUserStore();

const loadData = async () => {
  try {
    if (honorStore.honors.length === 0) {
      await honorStore.getHonors();
    }
    
    if (pathfinderStore.pathfinders.length === 0) {
      await pathfinderStore.getPathfinders();
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }
};

// Call loadData initially
loadData();

const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
const errorMessage = ref("An unexpected error occurred");

const retryLoading = () => {
  loadData();
};

const creatingPathfinder = ref(false);
const selectedPathfinder = ref(null);
const isEditModalOpen = ref(false);
const showToaster = ref(false);
const toasterMessage = ref("");

const canCreatePathfinder = computed(() =>
  userStore.permissions.includes("create:pathfinders")
);

const canUpdatePathfinder = computed(() =>
  userStore.permissions.includes("update:pathfinders")
);

function openEditModal(pathfinder) {
  selectedPathfinder.value = pathfinder;
  isEditModalOpen.value = true;
}

function handleEditSuccess() {
  isEditModalOpen.value = false;
}

function handleEditFailure(errorMessage) {
  toasterMessage.value = `Failed to edit: ${errorMessage}`;
  showToaster.value = true;
}

const submitAddForm = (data: PathfinderPost) => {
  pathfinderStore.postPathfinder(data);
  creatingPathfinder.value = false;
};
</script>

<style scoped>
.error-message {
  background-color: #ffeeee;
  border: 1px solid #ffcccc;
  color: #cc0000;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.loader {
  display: inline-block;
  font-size: 1.2em;
  color: #666;
}
</style>
