<template>
  <div class="outline">
    <form
      style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        align-items: start;
        justify-items: stretch;
        margin: 10px;
      "
      @submit.prevent="submitEditForm"
    >
      <div>
        <h3>Grade:</h3>
        <input
          v-model="formPathfinder.grade"
          type="number"
        >
        <p v-if="gradeError">
          {{ gradeError }}
        </p>
      </div>
      <div>
        <h3>Is Active:</h3>
        <input
          v-model="formPathfinder.isActive"
          type="checkbox"
        >
      </div>
      <div style="grid-column: 1 / -1; justify-self: center">
        <input
          type="submit"
          style="font-size: 1.5em; margin-top: 20px; width: auto"
          class="button-like"
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { usePathfinderStore } from "@/stores/pathfinders";

export default defineComponent({
  props: {
    pathfinder: {
      type: Object,
      required: true,
    },
  },
  emits: ['edit-success', 'edit-failure'],
  setup(props, { emit }) {
    const formPathfinder = reactive({
      grade: props.pathfinder.grade,
      isActive: props.pathfinder.isActive,
    });
    const gradeError = ref("");
    const pathfinderStore = usePathfinderStore();

    const validateGrade = () => {
      const gradeValue = formPathfinder.grade;
      if (gradeValue !== null && (gradeValue < 5 || gradeValue > 12)) {
        gradeError.value = "Grade must be between 5 and 12";
        return false;
      }
      gradeError.value = "";
      return true;
    };

    const submitEditForm = async () => {
      if (!validateGrade()) {
        return; // Stop submission if grade is invalid
      }

      try {
        await pathfinderStore.updatePathfinder(props.pathfinder.pathfinderID, {
          ...formPathfinder,
        });
        emit("edit-success");
      } catch (err: unknown) {
        console.error("Failed to submit edit form:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        emit("edit-failure", errorMessage);
      }
    };

    return {
      formPathfinder,
      gradeError,
      submitEditForm,
    };
  },
});
</script>
