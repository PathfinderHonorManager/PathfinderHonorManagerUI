import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAuth0 } from "@auth0/auth0-vue";
import piniaPersist from "pinia-plugin-persist";
import SimpleTypeahead from 'vue3-simple-typeahead';

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPersist);
const app = createApp(App);

app.use(
  createAuth0({
    domain: "pathfinderhonormanager.us.auth0.com",
    client_id: "mfTYOD64ySERkhLAatJBxWIULeq892fK",
    redirect_uri: window.location.origin,
    audience: "https://pathfinderhonormanager.azurewebsites.net/api/",
    cacheLocation: "localstorage",
  })
);

app.use(pinia);

app.use(router);

app.use(SimpleTypeahead);

app.mount("#app");
