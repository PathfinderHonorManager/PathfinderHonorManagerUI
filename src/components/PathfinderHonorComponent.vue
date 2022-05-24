<template>
  <div class="power" v-if="display" style="display: inline-block; margin: 0.5em; width: 14em; height: auto; overflow: hidden;">
    <form
      id="honorform"
      @submit.prevent="putPathfinderHonor(pathfinderID, honorID, newStatus)"
    >
      <div class="selectcontainer">
        <h3>{{ name }}</h3>
        <select v-model="newStatus">
          <option>Planned</option>
          <option>Earned</option>
          <option>Awarded</option>
        </select>
        <button>Update Status <strong>&check;</strong></button>
      </div>
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
  background-color: var(--bgColor);
  color: var(--color);
  font-weight: bold;
  width: 65%;
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 0.75em;
  transition: 0.2s;
}

select:focus > option {
  border: none;
  outline: none;
  padding: 0.5em;
}

.selectcontainer {
  margin-bottom: 0.5em;
}

.selectcontainer > * {
  margin-left: 10px;
}

.selectcontainer > button {
  width: 65%;
}
</style>
