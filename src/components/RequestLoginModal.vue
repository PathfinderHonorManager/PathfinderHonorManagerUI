<template>
  <div
    v-if="!isAuthenticated"
    style="
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-shadow: 14em 300px 600px var(--bgColor) inset;
      z-index: 3;
    "
  >
    <div
      class="power"
      style="
        position: fixed;
        height: 400px;
        width: 600px;
        margin: 0;
        left: calc(50% - 300px);
        top: calc(50% - 200px);
        text-align: center;
        box-shadow: 0 0 200px black;
        z-index: 4;
      "
    >
      <p
        class="light"
        style="font-size: 1.2em"
      >
        Log In
      </p>
      <h1 style="margin: 0.5em">
        View club members, and add or edit honors!
      </h1>
      <button
        style="margin: 1em; font-size: 1.2em; padding: 1em"
        @click="login"
      >
        Log In.
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    return {
      login: () => {
        loginWithRedirect();
      },
      isAuthenticated,
    };
  },
});
</script>
