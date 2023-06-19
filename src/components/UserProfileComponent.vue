<template>
  <div>
    <div id="profile-hunk">
      <div v-if="isAuthenticated">
        <img v-bind:src="user.picture" />
        <h1>{{ user.name }}</h1>
        <button
          @click="logout"
          style="background-color: inherit; border: var(--lightBorder)"
        >
          Log out
        </button>
      </div>
      <div v-else>
        <button @click="login" style="background-color: var(--darkBlue)">
          Log in
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue/dist/vue.esm-bundler";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
      },
      user,
      isAuthenticated,
    };
  },
});
</script>

<style scoped>
@import "/src/assets/general.css";

#profile-hunk {
  margin-top: 4em;
  text-align: center;
}

img {
  display: inline;
  margin-bottom: 0.25em;
  width: auto;
  height: 50px;
  border-radius: 50%;
}

h1 {
  margin: 0;
}

button {
  display: inline;
  margin: 0;
  margin-top: 1em;
  margin-bottom: 2em;
  background-color: var(--secondaryColor);
  color: var(--color);
  width: 65%;
  border: none;
  padding: 1em;
  font-weight: bolder;
}
</style>
