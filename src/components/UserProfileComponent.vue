<template>
  <div>
    <div v-if="isAuthenticated">
      <h2>User Profile</h2>
      <button @click="logout">Log out</button>
      <pre v-if="isAuthenticated">
          <code>{{ user }}</code>
        </pre>
    </div>
    <div v-else>
      <button @click="login">Log in</button>
    </div>
  </div>
</template>

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
