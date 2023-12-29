<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  options: {
    type: Array<string>,
    required: true,
  },
  selectedOption: {
    type: String,
    required: false,
  },
});

let selection = ref(props.selectedOption);

let expanded = ref(false);
</script>

<template>
  <div id="accordion">
    <button class="option" id="title" @click="expanded = !expanded">
      {{ selection }}
    </button>
    <div v-if="expanded">
      <div id="options" v-for="(option, index) of options" :key="option">
        <button
          :value="option"
          :class="index == options.length - 1 ? 'option last' : 'option'"
          @click="
            selection = option;
            expanded = false;
          "
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#accordion {
  box-sizing: border-box;
  background-color: var(--lightGrey);
  padding: 0;
  border-radius: 5px;

  display: grid;
}

#title {
  border-radius: 5px;
}

#options {
  display: grid;
  padding: 0;
}
.option {
  background-color: var(--grey);
  border: none;
  border-radius: 0;
  padding: 10px;
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}

.last {
  border-radius: 0 0 5px 5px;
}

button {
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

button:hover {
  background-color: var(--lightGrey);
  transform: none;
  box-shadow: none;
}

#options > button {
  border-top: 1px solid var(--lightGrey);
}
</style>
