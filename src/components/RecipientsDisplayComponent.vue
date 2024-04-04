<template>
  <div class="outline selection-container">
    <button
      v-for="(pathfinder, i) in pathfinders"
      :key="i"
      class="button"
      :class="{
        'is-ineligible': !isEligible(pathfinder.pathfinderID),
        'is-selected': isSelected(pathfinder.pathfinderID),
        'is-light-grey':
          !isSelected(pathfinder.pathfinderID) &&
          isEligible(pathfinder.pathfinderID),
      }"
      @click="toggleRecipientSelection(pathfinder.pathfinderID)"
      :title="
        isEligible(pathfinder.pathfinderID)
          ? ''
          : 'This pathfinder is not eligible for selection'
      "
    >
      {{ pathfinder.firstName }} {{ pathfinder.lastName }}
    </button>
  </div>
  <p>{{ recipients.length }} recipients selected</p>
  <p v-if="recipients.length == 1" class="note">
    When managing honors for individuals, we recommend doing it in the My Club
    page.
  </p>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useSelectionStore } from "@/stores/selectionStore";
import { usePathfinderStore } from "@/stores/pathfinders";
import { useHonorStore } from "@/stores/honors";

export default defineComponent({
  props: {
    selectionType: {
      type: String,
      required: true,
      validator: (value) => ["plan", "earn"].includes(value),
    },
  },
  setup(props) {
    const selectionStore = useSelectionStore();
    const pathfinderStore = usePathfinderStore();
    const honorStore = useHonorStore();
    const pathfinders = ref(pathfinderStore.pathfinders);

    const selectedHonors = computed(() => {
      return honorStore.getHonorsBySelection(props.selectionType);
    });

    const recipients = computed(() => {
      return pathfinderStore.getPathfindersBySelection(props.selectionType);
    });

    const selectedHonorIDs = computed(
      () => new Set(selectedHonors.value.map((honor) => honor.honorID)),
    );

    const toggleRecipientSelection = (pathfinderID: string) => {
      if (isEligible(pathfinderID)) {
        selectionStore.toggleSelection(
          props.selectionType,
          pathfinderID,
          "pathfinders",
        );
      }
    };

    watch(
      [selectedHonors, pathfinders],
      () => {
        const ineligiblePathfinders = pathfinders.value.filter(
          (p) => !isEligible(p.pathfinderID),
        );
        ineligiblePathfinders.forEach((p) => {
          if (isSelected(p.pathfinderID)) {
            selectionStore.toggleSelection(
              props.selectionType,
              p.pathfinderID,
              "pathfinders",
            );
          }
        });
      },
      { deep: true },
    );

    const isSelected = (pathfinderID: string) => {
      return selectionStore.selections[
        props.selectionType
      ].pathfinders.includes(pathfinderID);
    };

    const isEligible = (pathfinderID: string): boolean => {
      const pathfinder = pathfinderStore.pathfinders.find(
        (p) => p.pathfinderID === pathfinderID,
      );
      if (!pathfinder || !pathfinder.pathfinderHonors || selectedHonorIDs.value.size === 0) {
        return false;
      }

      if (props.selectionType === "earn") {
        return pathfinder.pathfinderHonors.some(
          (honor) =>
            selectedHonorIDs.value.has(honor.honorID) &&
            honor.status === "Planned",
        );
      } else if (props.selectionType == "plan") {
        return pathfinder.pathfinderHonors.every(
          (honor) => !selectedHonorIDs.value.has(honor.honorID),
        );
      } else {
        return false;
      }
    };

    return {
      pathfinders,
      recipients,
      toggleRecipientSelection,
      isSelected,
      isEligible,
    };
  },
});
</script>

<style>
.is-ineligible {
  background-color: var(--red);
}

.is-selected {
  background-color: var(--actionColor);
}

.is-light-grey {
  background-color: var(--lightGrey);
}
</style>
