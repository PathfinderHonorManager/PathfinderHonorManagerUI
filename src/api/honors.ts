import axios from "axios";
import { API_CONFIG } from "../config/api";

const BASE_URL = API_CONFIG.BASE_URL + "/honors";

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
