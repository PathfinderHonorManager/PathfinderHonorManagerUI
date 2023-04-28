<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import PathfinderComponent from "../components/PathfinderComponent.vue";
import ModalComponent from "../components/ModalComponent.vue";
import DetailTableItemComponent from "../components/DetailTableItemComponent.vue";
import { usePathfinderStore } from "../stores/pathfinders";

const pathfinderStore = usePathfinderStore();
const creatingPathfinder = ref(false);
</script>

<template>
  <h1>Eagles Club</h1>
  <div class="content-box">
    <h3 class="title">Here, You Can View Your Club's Honors</h3>
    <p class="note">Individually expand pathfinders to view their honor statuses.</p>
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

  <div style="display: flex; justify-content: right; padding-right: var(--content-padding); z-index: 1;">
    <button class="biglogobutton" @click="creatingPathfinder = true">+</button>
  </div>

  <PathfinderComponent />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Errors } from "../errors/errors";

export default defineComponent({
  components: {
    ModalComponent,
    DetailTableItemComponent,
  },
  methods: {
    postFormData: function () {
      const refs = this.$refs;
      function getRefValue(refName) {
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
