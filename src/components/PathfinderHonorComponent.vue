<template>
  <div class="outline" v-if="display" id="grid-item-parent">
    <div id="honor-info">
      <img
        :src="
          'https://images.pathfinderclub.tools/assets/honors/small/' + image
        "
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
          :class="canEdit ? 'primary button' : 'outline'"
          :style="{
            'pointer-events': canEdit ? 'auto' : 'none',
          }"
        >
          Update Status <strong>&check;</strong>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePathfinderStore } from "@/stores/pathfinders";

export default defineComponent({
  setup(props) {
    const pathfinderStore = usePathfinderStore();
    if (!pathfinderStore) {
      throw new Error("PathfinderStore is not provided");
    }

    const { pathfinders, loading, error } = storeToRefs(pathfinderStore);
    const newStatus = ref(props.status);

    const colors = ["var(--grey)", "var(--orange)", "mediumseagreen"];

    const resetButtonStyle = (event) => {
      const target = event.currentTarget;
      target.style.color = "grey";
      target.style.backgroundColor = "inherit";
      target.style.border = "var(lightBorder)";
      target.style.pointerEvents = "none";
    };

    const getSelectedIndex = (event) => {
      const target = event.target;
      const s = target.selectedIndex;
      target.style.backgroundColor = colors[s];
      let siblingButton = target.nextSibling;
      siblingButton.style.color = "var(--color)";
      siblingButton.style.backgroundColor = "var(--actionColor)";
      siblingButton.style.border = "";
      siblingButton.style.pointerEvents = "auto";
      if (siblingButton.getAttribute("listener") !== true) {
        siblingButton.addEventListener("click", resetButtonStyle);
      }
    };

    const colorAll = () => {
      const el = document.getElementsByClassName(
        "statusselector",
      ) as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < el.length; i++) {
        const selectElement = el[i] as HTMLSelectElement;
        selectElement.style.backgroundColor =
          colors[selectElement.selectedIndex];
        selectElement.addEventListener("change", getSelectedIndex);
      }
    };

    onMounted(() => {
      colorAll();
    });

    const selectedColor = computed(() => {
      const colors = {
        Planned: "var(--secondaryColor)",
        Earned: "var(--orange)",
        Awarded: "mediumseagreen",
      };
      return colors[newStatus.value];
    });

    const canEdit = computed(() => {
      return props.canUpdatePathfinder && newStatus.value !== props.status;
    });

    const updateColor = (event) => {
      newStatus.value = event.target.value;
    };

    return {
      loading,
      error,
      pathfinders,
      getPathfinders: pathfinderStore.getPathfinders,
      postPathfinderHonor: pathfinderStore.postPathfinderHonor,
      putPathfinderHonor: pathfinderStore.putPathfinderHonor,
      newStatus,
      selectedColor,
      canEdit,
      updateColor,
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
});
</script>

<style scoped>
#grid-item-parent {
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(150px, 1fr));
  grid-template-columns: 1fr;
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
  grid-template-rows: 0.5fr 1fr;
  grid-template-columns: 1fr;
  align-self: flex-end;
}

.selectcontainer > select {
  background-color: v-bind(selectedColor);
}

.selectcontainer > button {
  width: 1fr;
}
</style>
