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
      :header="pathfinder.firstName + ' ' + pathfinder.lastName"
    >
      <h3 v-if="pathfinder.className">
        {{ pathfinder.className }} (Grade {{ pathfinder.grade }})
      </h3>
      <h3 v-else>Staff</h3>

      <button
        v-if="!showing[i]"
        @click="showing[i] = true"
        class="outline button"
        style="margin: 0"
      >
        Show Honors ({{ pathfinder.pathfinderHonors?.length }})
      </button>
      <button
        v-if="showing[i]"
        @click="showing[i] = false"
        class="outline button"
        style="margin: 0"
      >
        Hide Honors ({{ pathfinder.pathfinderHonors?.length }})
      </button>

      <PostPathfinderHonorComponent
        v-if="showing[i] && canUpdatePathfinder"
        :pathfinderID="pathfinder.pathfinderID"
      />

      <div class="content-box">
        <div v-if="showing[i]" class="honortable">
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
          ></PathfinderHonorComponent>
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
        @submit.prevent="postFormData()"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap-reverse;
          margin: 0;
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

        <input
          type="submit"
          style="font-size: 1.5em; margin: 20px"
          class="button-like"
        />
      </form>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import DetailTableItemComponent from "./DetailTableItemComponent.vue";
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";
import ModalComponent from "./ModalComponent.vue";
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

    const displays = [];
    const showing = ref(displays);

    const canCreatePathfinder = computed(() =>
      userStore.permissions.includes("create:pathfinders")
    );
    const canUpdatePathfinder = computed(() =>
      userStore.permissions.includes("update:pathfinders")
    );
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const grade = ref("");
    const firstNameError = ref("");
    const lastNameError = ref("");
    const emailError = ref("");
    const gradeError = ref("");

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
    };
  },
  methods: {
    postFormData: function () {
      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        grade: this.grade === "" ? null : Number(this.grade),
      };

      // Validate the form data
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
      if (data.grade !== null && (data.grade < 4 || data.grade > 12)) {
        this.gradeError = "Grade must be between 4 and 12";
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

      // Only submit the form if it is valid
      if (isValid) {
        this.postPathfinder(data);
        this.creatingPathfinder = false;
      }
    },
  },
});
</script>
