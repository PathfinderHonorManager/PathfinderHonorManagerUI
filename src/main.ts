import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAuth0 } from "@auth0/auth0-vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import SimpleTypeahead from "vue3-simple-typeahead";
import { useHonorStore } from "./stores/honors";
import { usePathfinderStore } from "./stores/pathfinders";
import { useUserStore } from "./stores/users";
import App from "./App.vue";
import router from "./router";
import { analyticsPlugin } from "./plugins/analytics";
import { API_CONFIG, AUTH0_CONFIG } from "./config/api";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

const auth0Config = {
  domain: AUTH0_CONFIG.DOMAIN,
  clientId: AUTH0_CONFIG.CLIENT_ID,
  cacheLocation: "memory" as const,
  authorizationParams: {
    redirect_uri: AUTH0_CONFIG.REDIRECT_URI,
    audience: API_CONFIG.AUTH_AUDIENCE,
  },
};

const auth0 = createAuth0(auth0Config);
app.use(auth0);

app.use(pinia);

app.use(router);

app.use(SimpleTypeahead);
app.use(analyticsPlugin);

//provide honors and pathfinder to all components
app.provide("usePathfinderStore", usePathfinderStore);
app.provide("useHonorStore", useHonorStore);
app.provide("useUserStore", useUserStore);

console.log(app);

app.mount("#app");
