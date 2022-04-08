import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAuth0 } from "@auth0/auth0-vue";
import { jwtInterceptor } from "./api/jwtInterceptor";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(
  createAuth0({
    domain: "pathfinderhonormanager.us.auth0.com",
    client_id: "mfTYOD64ySERkhLAatJBxWIULeq892fK",
    redirect_uri: window.location.origin,
    audience: "https://pathfinderhonormanager.azurewebsites.net/api/",
  })
);

jwtInterceptor();
app.use(createPinia());
app.use(router);

app.mount("#app");
