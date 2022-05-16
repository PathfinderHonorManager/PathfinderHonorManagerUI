<template>
  <div>
    <div v-if="isAuthenticated">
      <h2>Profile</h2>
      <img v-bind:src="user.picture">
      <p>{{ user.name }}</p>
      <button @click="logout">Log out</button>
    </div>
    <div v-else>
      <button @click="login">Log in</button>
    </div>
  </div>
</template>

<style scoped>
@import "/src/assets/general.css";

div {
  margin: 2em;
  float: left;
}

img {
  display: block;
  margin-top: 1em;
  margin-bottom: 1em;
  border-radius: 50%;
}

button {
  display: block;
  background-color: var(--yellow);
  color: var(--bgColor);
  border: none;
  padding: 1em;
  font-weight: bolder;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ returnTo: window.location.origin });
      },
      user,
      isAuthenticated,
    };
  },
});
</script>
