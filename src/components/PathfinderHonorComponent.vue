<template>
  <div
    class="outline"
    v-if="display"
    style="
      display: grid;
      width: 100%;
      margin: 0;
      height: auto;
      overflow: hidden;
      text-align: center;
    "
  >
    <form
      id="honorform"
      @submit.prevent="putPathfinderHonor(pathfinderID, honorID, newStatus)"
    >
      <div class="selectcontainer">
        <img
          :src="'https://pathfinderhonor.azureedge.net/assets/small/' + image"
          class="patchimage"
        />
        <br />
        <h3>{{ name }}</h3>
        <select v-model="newStatus" class="statusselector">
          <option value="Planned">Planned</option>
          <option value="Earned">Earned</option>
          <option value="Awarded">Awarded</option>
        </select>
        <button class="outline" style="pointer-events: none; color: grey;">Update Status <strong>&check;</strong></button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
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
      const el = document.getElementsByClassName("statusselector") as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < el.length; i++) {
        el[i].style.backgroundColor = colors[el[i].selectedIndex];
        el[i].addEventListener("change", getSelectedIndex);
      }
    }

    colorAll();

    return {
      loading,
      error,
      pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      putPathfinderHonor: pathfinderStore.putPathfinderHonor,
      getSelectedIndex,
      resetButtonStyle,
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
  },
  data() {
    return {
      newStatus: this.status,
    };
  },
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
  margin-bottom: var(--standard);
  margin-top: var(--standard);
  background-color: var(--bgColor);
  color: var(--color);
  font-weight: bold;
  width: 100%;
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

.selectcontainer > button {
  width: 100%;
}
</style>
