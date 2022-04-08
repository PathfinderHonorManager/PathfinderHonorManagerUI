<template>
  <div>
    <button @click="logout">Log out</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { logout } = useAuth0();

    return {
      logout: () => {
        logout({ returnTo: window.location.origin });
      },
    };
  },
});
</script>
