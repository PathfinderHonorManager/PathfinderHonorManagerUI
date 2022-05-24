<template>
  <div
    class="power"
    v-if="display"
    style="
      display: inline-block;
      margin: 0.5em;
      width: 14em;
      height: auto;
      overflow: hidden;
    "
  >
    <form
      id="honorform"
      @submit.prevent="putPathfinderHonor(pathfinderID, honorID, newStatus)"
    >
      <div class="selectcontainer">
        <img
          :src="'https://pathfinderhonor.azureedge.net/assets/small/' + image"
        />
        <br />
        <h3>{{ name }}</h3>
        <select v-model="newStatus" class="statusselector">
          <option value="Planned">Planned</option>
          <option value="Earned">Earned</option>
          <option value="Awarded">Awarded</option>
        </select>
        <button>Update Status <strong>&check;</strong></button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePathfinderStore } from "../stores/pathfinders";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const pathfinderStore = usePathfinderStore();

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);

    const colors = ["var(--bgColor)", "var(--orange)", "mediumseagreen"];
    function getSelectedIndex() {
      const s = this.selectedIndex;
      this.style.backgroundColor = colors[s];
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

select[selectedindex="1"] {
  background-color: mediumseagreen;
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

.selectcontainer > img {
  width: 100px;
  height: auto;
  border: 3px dashed var(--orange);
  border-radius: 50%;
  box-shadow: 0 0 10px black;
}
</style>
