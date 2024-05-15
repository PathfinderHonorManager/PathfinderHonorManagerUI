<template>
  <p v-if="error">Error!</p>
  <span class="loader" v-if="loading">Loading Pathfinders</span>
  <div v-if="pathfinders[0]" class="content-box">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin: 0;
        padding: 0;
      "
    >
      <h3 style="margin: 0">{{ pathfinders.length }} Members</h3>
      <button
        class="biglogobutton"
        @click="creatingPathfinder = true"
        v-if="canCreatePathfinder"
      >
        +
      </button>
    </div>

    <DetailTableItemComponent
      v-for="(pathfinder, i) in pathfinders"
      :key="i"
    >
      <div class="pathfinder-header">
        <h2 class="pathfinder-name h2-with-bar">
          {{ pathfinder.firstName }} {{ pathfinder.lastName }}
        </h2>
        <div class="pathfinder-details-container">
          <h2 v-if="pathfinder.className" class="pathfinder-details">
            {{ pathfinder.className }} (Grade {{ pathfinder.grade }})
          </h2>
          <h2 v-else>Staff</h2>
          <FontAwesomeIcon
            v-if="canUpdatePathfinder"
            :icon="faPencil"
            @click="openEditModal(pathfinder)"
            size="s"
            class="fontawesome-icon"
          />
        </div>
      </div>

      <button
        v-if="!showing[pathfinder.pathfinderID]"
        @click="showing[pathfinder.pathfinderID] = true"
        class="outline button"
        style="margin: 0"
      >
        Show Honors ({{ pathfinder.pathfinderHonors?.length }})
      </button>
      <button
        v-if="showing[pathfinder.pathfinderID]"
        @click="showing[pathfinder.pathfinderID] = false"
        class="outline button"
        style="margin: 0"
      >
        Hide Honors ({{ pathfinder.pathfinderHonors?.length }})
      </button>

      <PostPathfinderHonorComponent
        v-if="showing[pathfinder.pathfinderID] && canUpdatePathfinder"
        :pathfinderID="pathfinder.pathfinderID"
      />

      <div v-if="showing[pathfinder.pathfinderID]" class="content-box">
        <div class="honortable">
          <PathfinderHonorComponent
            v-for="pathfinderHonor in pathfinder.pathfinderHonors"
            :key="pathfinderHonor.pathfinderHonorID"
            :item="postPathfinderHonor"
            v-bind:pathfinderID="pathfinder.pathfinderID"
            v-bind:honorID="pathfinderHonor.honorID"
            v-bind:name="pathfinderHonor.name"
            v-bind:status="pathfinderHonor.status"
            v-bind:display="true"
            v-bind:image="pathfinderHonor.patchFilename"
            :canUpdatePathfinder="canUpdatePathfinder"
          >
          </PathfinderHonorComponent>
        </div>
      </div>
    </DetailTableItemComponent>
  </div>

  <ModalComponent
    header="Add a Pathfinder!"
    :closed="!creatingPathfinder"
    @modal-closed="creatingPathfinder = false"
  >
    <div class="outline">
      <form
        @submit.prevent="submitAddForm()"
        style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          align-items: start;
          justify-items: stretch;
          margin: 10px;
        "
      >
        <div>
          <h3>First Name:</h3>
          <input type="text" v-model="firstName" />
          <p v-if="firstNameError">{{ firstNameError }}</p>
        </div>
        <div>
          <h3>Last Name:</h3>
          <input type="text" v-model="lastName" />
          <p v-if="lastNameError">{{ lastNameError }}</p>
        </div>
        <div>
          <h3>Email:</h3>
          <input type="text" v-model="email" />
          <p v-if="emailError">{{ emailError }}</p>
        </div>
        <div>
          <h3>Grade:</h3>
          <input type="text" v-model="grade" />
          <p v-if="gradeError">{{ gradeError }}</p>
        </div>
        <div style="grid-column: 1 / -1; justify-self: center">
          <input
            type="submit"
            style="font-size: 1.5em; margin-top: 20px; width: auto"
            class="button-like"
          />
        </div>
      </form>
    </div>
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

<script lang="ts">
import { defineComponent, ref, computed, toRefs, reactive } from "vue";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DetailTableItemComponent from "./DetailTableItemComponent.vue";
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import EditPathfinderComponent from "./EditPathfinderComponent.vue";
import ToasterComponent from "./ToasterComponent.vue"; // Added import for ToasterComponent
import { storeToRefs } from "pinia";
import { usePathfinderStore } from "@/stores/pathfinders";
import { useHonorStore } from "@/stores/honors";
import { useUserStore } from "@/stores/users";

export default defineComponent({
  components: {
    PostPathfinderHonorComponent,
    PathfinderHonorComponent,
    DetailTableItemComponent,
    ModalComponent,
    EditPathfinderComponent,
    FontAwesomeIcon,
    ToasterComponent,
  },
  setup() {
    const pathfinderStore = usePathfinderStore();
    if (!pathfinderStore) {
      throw new Error("PathfinderStore is not provided");
    }

    const honorStore = useHonorStore();
    if (!honorStore) {
      throw new Error("HonorStore is not provided");
    }

    const userStore = useUserStore();
    if (!userStore) {
      throw new Error("UserStore is not provided");
    }

    honorStore.honors.length === 0 ? honorStore.getHonors() : undefined;
    pathfinderStore.pathfinders.length === 0
      ? pathfinderStore.getPathfinders()
      : undefined;

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const { honors } = storeToRefs(honorStore);

    const creatingPathfinder = ref(false);

    const showing = ref({});

    const canCreatePathfinder = computed(() =>
      userStore.permissions.includes("create:pathfinders"),
    );
    const canUpdatePathfinder = computed(() =>
      userStore.permissions.includes("update:pathfinders"),
    );
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const grade = ref("");
    const firstNameError = ref("");
    const lastNameError = ref("");
    const emailError = ref("");
    const gradeError = ref("");

    const selectedPathfinder = ref(null);
    const isEditModalOpen = ref(false);

    const showToaster = ref(false);
    const toasterMessage = ref("");

    const formPathfinder = reactive({ grade: null, isActive: null });

    function openEditModal(pathfinder) {
      selectedPathfinder.value = pathfinder;
      Object.assign(formPathfinder, {
        grade: pathfinder.grade,
        isActive: pathfinder.isActive,
      });
      isEditModalOpen.value = true;
    }

    function handleEditSuccess() {
      isEditModalOpen.value = false;
    }

    function handleEditFailure(errorMessage) {
      toasterMessage.value = `Failed to edit: ${errorMessage}`;
      showToaster.value = true;
    }
    return {
      loading,
      error,
      pathfinders,
      creatingPathfinder,
      postPathfinder: (fn: string, ln: string, em: string, gr: number) =>
        pathfinderStore.postPathfinder(fn, ln, em, gr),
      getPathfinders: pathfinderStore.getPathfinders,
      honors,
      getHonors: honorStore.getHonors,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      showing: showing,
      canCreatePathfinder,
      canUpdatePathfinder,
      firstName,
      lastName,
      email,
      grade,
      firstNameError,
      lastNameError,
      emailError,
      gradeError,
      selectedPathfinder,
      isEditModalOpen,
      formPathfinder,
      openEditModal,
      faPencil,
      handleEditSuccess,
      handleEditFailure,
      showToaster,
      toasterMessage,
    };
  },
  methods: {
    submitAddForm: function () {
      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        grade: this.grade === "" ? null : Number(this.grade),
      };

      let isValid = true;
      if (data.firstName === "") {
        this.firstNameError = "First name is required";
        isValid = false;
      } else {
        this.firstNameError = "";
      }
      if (data.lastName === "") {
        this.lastNameError = "Last name is required";
        isValid = false;
      } else {
        this.lastNameError = "";
      }
      if (data.grade !== null && (data.grade < 5 || data.grade > 12)) {
        this.gradeError = "Grade must be between 5 and 12";
        isValid = false;
      } else {
        this.gradeError = "";
      }
      if (data.email === "" || !data.email.includes("@")) {
        this.emailError = "Invalid email";
        isValid = false;
      } else {
        this.emailError = "";
      }

      if (isValid) {
        this.postPathfinder(data);
        this.creatingPathfinder = false;
      }
    },
  },
});
</script>
