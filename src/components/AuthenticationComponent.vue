<!-- eslint-disable vue/valid-template-root -->
<template>
  <!---->
</template>
<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import axios from "axios";

const { getAccessTokenSilently } = useAuth0();

axios.interceptors.request.use(
  async (config) => {
    const token = await getAccessTokenSilently();
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    console.log("Error:", error);
    return Promise.reject(error);
  },
);
</script>
