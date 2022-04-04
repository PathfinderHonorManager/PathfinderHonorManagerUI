import axios from "axios";
import type createAuth0Client from "@auth0/auth0-spa-js";
import type { Auth0Client, GetTokenSilentlyOptions } from "@auth0/auth0-spa-js";
import { ref } from "vue";

// I find it easier to set up an api call file for each endpoint,
// It's easier to read and understand.

const auth0Client = ref<Auth0Client | null>(null);

const BASE_URL =
  "https://pathfinderhonormanager.azurewebsites.net/api/pathfinders";

const getAccessToken = async (
  options?: GetTokenSilentlyOptions
): Promise<null | string> => {
  if (!auth0Client.value) {
    return null;
  }

  return (await auth0Client.value.getTokenSilently(options)) as string;
};

const token = await getAccessToken();

export default {
  getAll: (params = {}) => {
    return axios.get(BASE_URL, {
      params: params,
      headers: {
        Authentication: "Bearer " + token,
      },
    });
  },
  get: (id: number, params = {}) => {
    // I assume you can retreive pathfinders by id
    return axios.get(BASE_URL + `/${id}`, {
      params,
    });
  },
  post: (data = null) => {
    return axios.post(BASE_URL, data);
  },
};
