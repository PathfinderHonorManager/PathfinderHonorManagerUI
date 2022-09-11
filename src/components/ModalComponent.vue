<template>
  <div class="modal">
    <div class="modal-content">
      <img src="/close-icon.svg" class="close-button" />
      <h1>{{ header }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  setup() {
    function activateModal() {
      console.log("modal active");
      const modal = getCurrentInstance().vnode.el;
      modal.style.display = "block";
      modal
        .getElementsByClassName("close-button")[0]
        .addEventListener("mousedown", function () {
          modal.style.display =
            modal.style.display === "block" ? "none" : "block";
        });
    }
    return {
      activateModal,
    };
  },
  mounted() {
    this.activateModal();
    const modal = getCurrentInstance().vnode.el;
    function toggleModal() {
      modal.style.display = modal.style.display === "block" ? "none" : "block";
    }
    return {
      toggleModal,
    };
  },
  methods() {
    return {
      activateModal: this.activateModal(),
      toggleModal: this.toggleModal(),
    }
  },
  props: {
    header: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
});
</script>

<style>
@import "@/assets/modals.css";
</style>
