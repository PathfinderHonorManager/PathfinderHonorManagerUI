<template>
  <div class="outline" v-if="display" id="grid-item-parent">
    <div id="honor-info">
      <img
        :src="'https://pathfinderhonor.azureedge.net/assets/small/' + image"
        class="patchimage"
      />
      <h3>{{ name }}</h3>
    </div>

    <form
      id="honorform"
      @submit.prevent="putPathfinderHonor(pathfinderID, honorID, newStatus)"
    >
      <div class="selectcontainer">
        <select v-model="newStatus" class="statusselector">
          <option value="Planned">Planned</option>
          <option value="Earned">Earned</option>
          <option value="Awarded">Awarded</option>
        </select>
        <button
          v-if="canUpdatePathfinder"
          class="outline"
          style="pointer-events: none; color: grey"
        >
          Update Status <strong>&check;</strong>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup(props) {
    const usePathfinderStore = inject("usePathfinderStore");
    const pathfinderStore = usePathfinderStore();

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);

    function resetButtonStyle() {
      this.style.color = "grey";
      this.style.backgroundColor = "inherit";
      this.style.border = "var(lightBorder)";
      this.style.pointerEvents = "none";
    }

    const colors = ["var(--secondaryColor)", "var(--orange)", "mediumseagreen"];
    function getSelectedIndex() {
      const s = this.selectedIndex;
      this.style.backgroundColor = colors[s];
      let siblingButton = this.nextSibling;
      siblingButton.style.color = "var(--color)";
      siblingButton.style.backgroundColor = "var(--blue)";
      siblingButton.style.border = "";
      siblingButton.style.pointerEvents = "auto";
      if (siblingButton.getAttribute("listener") !== true) {
        siblingButton.addEventListener("click", resetButtonStyle);
      }
    }

    async function colorAll() {
      await document.getElementsByClassName("statusselector");
      const el = document.getElementsByClassName(
        "statusselector"
      ) as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < el.length; i++) {
        el[i].style.backgroundColor = colors[el[i].selectedIndex];
        el[i].addEventListener("change", getSelectedIndex);
      }
    }

    colorAll();

    const canUpdatePathfinder = props.canUpdatePathfinder;

    return {
      loading,
      error,
      pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      putPathfinderHonor: pathfinderStore.putPathfinderHonor,
      getSelectedIndex,
      resetButtonStyle,
      canUpdatePathfinder,
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
    image: {
      type: String,
      required: false,
    },
    canUpdatePathfinder: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      newStatus: this.status,
    };
  },
});
</script>

<style scoped>
#grid-item-parent {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
}

#honor-info {
  display: grid;
  justify-items: center;
  text-align: center;
  font-size: 0.8em;
}

button > strong {
  position: absolute;
  opacity: 0;
  transition: 0.4s;
}

button:focus > strong {
  position: relative;
  opacity: 1;
}

form {
  margin: 0;
  padding: 0;
  display: grid;
}

select {
  margin: var(--itemMargin) 0;
  background-color: var(--bgColor);
  color: var(--color);
  font-weight: bold;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  transition: 0.2s;
}

select:focus > option {
  border: none;
  outline: none;
  padding: 0.5em;
}

.selectcontainer {
  margin: 0;

  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 100%;
  align-self: flex-end;
}

.selectcontainer > button {
  width: 100%;
}
</style>
