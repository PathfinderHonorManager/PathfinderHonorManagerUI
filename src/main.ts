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

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

const auth0Config = {
  domain: "pathfinderhonormanager.us.auth0.com",
  clientId: "mfTYOD64ySERkhLAatJBxWIULeq892fK",
  cacheLocation: "memory" as const,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: "https://pathfinderhonormanager.azurewebsites.net/api/",
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
