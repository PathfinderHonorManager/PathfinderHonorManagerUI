<template>
  <div class="power" v-if="display">
    <form
      id="honorform"
      @submit.prevent="putPathfinderHonor(pathfinderID, honorID, newStatus)"
    >
      <td>
        <h3>{{ name }}</h3>
      </td>
      <td style="display: inline;">
        <select v-model="newStatus">
          <option>Planned</option>
          <option>Earned</option>
          <option>Awarded</option>
        </select>
        <button>Update Status <strong>&check;</strong></button>
      </td>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { usePathfinderStore } from "../stores/pathfinders";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const pathfinderStore = usePathfinderStore();

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);

    return {
      loading,
      error,
      pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      putPathfinderHonor: pathfinderStore.putPathfinderHonor,
    };
  },
  props: {
    pathfinderID: {
      type: String,
      required: true,
    },
    honorID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    display: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      newStatus: this.status
    }
  }
});
</script>

<style>

button > strong {
  position: absolute;
  opacity: 0;
  transition: 0.4s;
}

button:focus > strong {
  position: relative;
  opacity: 1;
}

select {
  margin: 10px;
  background-color: transparent;
  color: var(--color);
  outline: 2px solid var(--color);
  border-radius: 5px;
  padding: 0.5em;
}
option {
  background-color: inherit;
  color: black;
}

option:hover {
  background-color: var(--blue);
  color: var(--color)
}
</style>
