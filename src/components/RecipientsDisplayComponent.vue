<template>
  <div class="outline" style="display: flex">
    <button
      v-for="(recipient, i) in pathfinders"
      :key="i"
      class="button"
      :class="{
        'is-ineligible': pathfinderHasSelectedHonor(recipient.pathfinderID),
        'is-selected':
          pathfinderStore.isSelected(recipient.pathfinderID) &&
          !pathfinderHasSelectedHonor(recipient.pathfinderID),
        'is-light-grey':
          !pathfinderStore.isSelected(recipient.pathfinderID) &&
          !pathfinderHasSelectedHonor(recipient.pathfinderID),
      }"
      @click="toggleRecipientSelection(recipient.pathfinderID)"
      :title="
        pathfinderHasSelectedHonor(recipient.pathfinderID)
          ? 'This pathfinder already has the selected honor'
          : ''
      "
    >
      {{ recipient.firstName }} {{ recipient.lastName }}
    </button>
  </div>
  <p>{{ recipients.length }} recipients selected</p>
  <p v-if="recipients.length == 1" class="note">
    When planning honors for individuals, we recommend doing it in the My Club
    page.
  </p>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";

export default defineComponent({
  props: {
    pathfinders: Array as PropType<Pathfinder[]>,
    recipients: Array as PropType<Recipient[]>,
    selectedHonors: Array as PropType<SelectedHonor[]>,
    pathfinderStore: Object as PropType<PathfinderStoreType>,
  },
  emits: ["selectionChanged"],
  setup(props, { emit }) {
    const { pathfinders, recipients, selectedHonors, pathfinderStore } =
      toRefs(props);

    const pathfinderHasSelectedHonor = (pathfinderID) => {
      const pathfinder = pathfinders.value.find(
        (p) => p.pathfinderID === pathfinderID,
      );
      return (
        pathfinder &&
        pathfinder.pathfinderHonors.some((honor) =>
          selectedHonors.value.some(
            (selectedHonor) => selectedHonor.honorID === honor.honorID,
          ),
        )
      );
    };

    const toggleRecipientSelection = (pathfinderID) => {
      pathfinderStore.value.toggleSelection(pathfinderID);
      emit("selectionChanged");
    };

    return {
      pathfinderHasSelectedHonor,
      toggleRecipientSelection,
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
