import axios from "axios";

// I find it easier to set up an api call file for each endpoint,
// It's easier to read and understand.

const BASE_URL =
  "https://pathfinderhonormanager.azurewebsites.net/api/pathfinders";

export default {
  getAll: (params = {}) => {
    return axios.get(BASE_URL, {
      params,
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
