<!-- eslint-disable prettier/prettier -->
<template>
  <p v-if="error">Error!</p>
  <span class="loader" v-if="loading">Loading Pathfinders</span>
  <div v-if="pathfinders[0]" class="content-box">

    <div
      style="display: flex; justify-content: space-between; align-items: flex-end; margin: 0; padding: 0"
    >
      <h3 style="margin: 0;">Eagles Club, {{ pathfinders.length }} Members</h3>
      <button class="biglogobutton" @click="creatingPathfinder = true">
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
        v-if="showing[i]"
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
        @submit.prevent="
          postFormData();
          creatingPathfinder = false;
        "
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
          <input type="text" ref="firstName" />
        </div>
        <div>
          <h3>Last Name:</h3>
          <input type="text" ref="lastName" />
        </div>
        <div>
          <h3>Grade:</h3>
          <input type="text" ref="grade" />
        </div>
        <div>
          <h3>Email:</h3>
          <input type="text" ref="email" />
        </div>

        <input type="submit" style="font-size: 1.5em; margin: 20px;" class="button-like" />
      </form>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import DetailTableItemComponent from "./DetailTableItemComponent.vue";
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import { Errors } from "../errors/errors";
import { storeToRefs } from "pinia";

export default defineComponent({
  components: {
    PostPathfinderHonorComponent,
    PathfinderHonorComponent,
    DetailTableItemComponent,
    ModalComponent,
  },
  setup() {
    const usePathfinderStore = inject("usePathfinderStore");
    const useHonorStore = inject("useHonorStore");

    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();

    honorStore.honors ? honorStore.getHonors() : undefined;
    pathfinderStore.pathfinders ? pathfinderStore.getPathfinders() : undefined;

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const { honors } = storeToRefs(honorStore);

    const creatingPathfinder = ref(false);

    const displays = [];
    const showing = ref(displays);
    console.log(showing);

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
    };
  },
  methods: {
    postFormData: function () {
      const refs = this.$refs;
      function getRefValue(refName: string) {
        return refs[refName].value;
      }
      const data = {
        firstName: getRefValue("firstName"),
        lastName: getRefValue("lastName"),
        email: getRefValue("email"),
        grade: Number(getRefValue("grade")),
      };

      if (data.firstName === "") {
        throw Errors.postFormData.invalidFirstName;
      }
      if (data.lastName === "") {
        throw Errors.postFormData.invalidLastName;
      }
      if ((data.grade < 4 && data.grade != 0) || data.grade > 12) {
        throw Errors.postFormData.invalidGrade;
      }
      if (data.email === "" || !data.email.includes("@")) {
        throw Errors.postFormData.invalidEmail;
      }

      pathfinderStore.postPathfinder(data);
    },
  },
});
</script>
