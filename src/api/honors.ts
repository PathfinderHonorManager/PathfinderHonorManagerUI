import axios from "axios";

const BASE_URL = "https://pathfinderhonormanager.azurewebsites.net/api/honors";

export default {
  getAll: (params = {}) => {
    return axios.get(BASE_URL, {
      params,
    });
  },
  get: (id: number, params = {}) => {
    return axios.get(BASE_URL + `/${id}`, {
      params,
    });
  },
  post: (data = null) => {
    return axios.post(BASE_URL, data);
  },
};
