<template>
    <div class="outline">
        <form @submit.prevent="submitEditForm"
            style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: start; justify-items: stretch; margin: 10px;">
            <div>
                <h3>Grade:</h3>
                <input type="number" v-model="formPathfinder.grade" />
                <p v-if="gradeError">{{ gradeError }}</p>
            </div>
            <div>
                <h3>Is Active:</h3>
                <input type="checkbox" v-model="formPathfinder.isActive" />
            </div>
            <div style="grid-column: 1 / -1; justify-self: center;">
                <input type="submit" style="font-size: 1.5em; margin-top: 20px; width: auto;" class="button-like" />
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
                await pathfinderStore.updatePathfinder(props.pathfinder.pathfinderID, { ...formPathfinder });
                emit("edit-success");
            } catch (err) {
                console.error("Failed to submit edit form:", err);
                emit("edit-failure", err.message || "Unknown error");
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
