import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAuth0 } from "@auth0/auth0-vue";
import piniaPersist from "pinia-plugin-persist";
import SimpleTypeahead from 'vue3-simple-typeahead';
import { useHonorStore } from "./stores/honors";
import { usePathfinderStore } from "./stores/pathfinders";

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPersist);
const app = createApp(App);

const auth0Config = {
  domain: "pathfinderhonormanager.us.auth0.com",  
  client_id: "mfTYOD64ySERkhLAatJBxWIULeq892fK",  
  authorizationParams: {
    redirect_uri: window.location.origin,  
    audience: "https://pathfinderhonormanager.azurewebsites.net/api/",  
  },
  cacheLocation: "localstorage"
};

app.use(createAuth0(auth0Config));

app.use(pinia);

app.use(router);

app.use(SimpleTypeahead);

//provide honors and pathfinder to all components
app.provide("usePathfinderStore", usePathfinderStore);
app.provide("useHonorStore", useHonorStore);

console.log(app)

app.mount("#app");
