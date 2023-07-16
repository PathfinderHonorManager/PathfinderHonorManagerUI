<template>
  <div id="profile-hunk">
    <div v-if="isAuthenticated">
      <img v-bind:src="user.picture" />
      <h1>{{ user.name }}</h1>
      <button @click="logout" style="background-color: inherit">Log out</button>
    </div>
    <div v-else>
      <button @click="login" style="background-color: var(--darkBlue)">
        Log in
      </button>
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
  margin: 0;
  padding: 0;
  justify-content: center;
  text-align: center;
}

img {
  width: auto;
  height: 50px;
  border-radius: 50%;
  margin: 0.5em;
}

h1 {
  font-size: 1.8em;
  margin: var(--itemMargin);
  margin-bottom: 1em;
  margin-top: 0;
}

button {
  margin: 0;
  background-color: var(--secondaryColor);
  color: var(--color);
  width: 100%;
  height: 50px;
  padding: var(--itemMargin);
  font-weight: bolder;
  font-size: 1.2em;
  text-align: left;
}

@media screen and (max-width: 1080px) {
  #profile-hunk {
    width: 100%;
    grid-column: span 2;
  }
  button {
    text-align: center;
    border: var(--lightBorder);
  }
}
</style>
