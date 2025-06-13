<template>
  <div id="profile-hunk">
    <div v-if="isAuthenticated">
      <div class="avatar-container">
        <img 
          v-if="!imageError && user?.picture" 
          :src="user.picture" 
          :alt="`${user?.name || 'User'} avatar`"
          @error="handleImageError"
        >
        <div
          v-else
          class="fallback-avatar"
        >
          {{ userInitials }}
        </div>
      </div>
      <h1>{{ user?.name }}</h1>
      <button @click="logout">
        Log out
      </button>
    </div>
    <div v-else>
      <button
        style="background-color: var(--actionColor)"
        @click="login"
      >
        Log in
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
    const imageError = ref(false);

    const handleImageError = () => {
      imageError.value = true;
    };

    const userInitials = computed(() => {
      if (!user.value?.name) return 'U';
      
      const names = user.value.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    });

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
      },
      user,
      isAuthenticated,
      imageError,
      handleImageError,
      userInitials,
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

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5em;
}

img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.fallback-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--actionColor);
  color: var(--color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
}

h1 {
  font-size: 1.8em;
  margin: var(--itemMargin);
  margin-bottom: 1em;
  margin-top: 0;
}

button {
  margin: 0;
  background-color: inherit;
  color: var(--color);
  width: 100%;
  height: 50px;
  padding: var(--itemMargin);
  font-weight: bolder;
  font-size: 1.2em;
  text-align: left;
}

button:hover {
  box-shadow: none;
  transform: none;
  background-color: var(--grey);
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
