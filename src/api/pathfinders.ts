import axios from "axios";

const BASE_URL =
  "https://pathfinderhonormanager.azurewebsites.net/api/pathfinders";

export default {
  getAll: (params = {}) => {
    return axios.get(BASE_URL, {
      params,
    });
  },
  get: (id: string, params = {}) => {
    return axios.get(BASE_URL + `/${id}`, {
      params,
    });
  },
  post: (data = null) => {
    return axios.post(BASE_URL, data);
  },
  postPathfinderHonor: (id: string, data: JSON) => {
    return axios.post(BASE_URL + `/${id}/PathfinderHonors`, data);
  },
  putPathfinderHonor: (id: string, honorid: string, data: JSON) => {
    return axios.put(BASE_URL + `/${id}/PathfinderHonors/${honorid}`, data);
  },
};
