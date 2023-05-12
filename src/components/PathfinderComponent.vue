<template>
  <p v-if="error">Error!</p>
  <div v-if="pathfinders[0]" class="content-box">
    
    <h3>Eagles Club, {{ pathfinders.length }} Members</h3>

    <div
      style="display: flex; justify-content: flex-end; margin: 0; padding: 0"
    >
      <button class="biglogobutton" @click="creatingPathfinder = true">
        +
      </button>
    </div>

    <span class="loader" v-if="loading">Loading Pathfinders</span>
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
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";
import { useHonorStore } from "../stores/honors";
import DetailTableItemComponent from "./DetailTableItemComponent.vue";
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorComponent from "./PathfinderHonorComponent.vue";
import ModalComponent from "./ModalComponent.vue";

import { storeToRefs } from "pinia";
import { ref } from "vue";

const pathfinderStore = usePathfinderStore();
const honorStore = useHonorStore();

pathfinderStore.getPathfinders();
honorStore.getHonors();

const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
const { honors } = storeToRefs(honorStore);

export default defineComponent({
  components: {
    PostPathfinderHonorComponent,
    PathfinderHonorComponent,
    DetailTableItemComponent,
    ModalComponent,
  },
  setup() {
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
  }
});
</script>
