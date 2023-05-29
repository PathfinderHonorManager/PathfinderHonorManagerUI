import axios from "axios";
import type { AxiosResponse } from "axios";
import { Errors } from "../errors/errors";

const BASE_URL =
  "https://pathfinderhonormanager.azurewebsites.net/api/pathfinders";

interface PathfinderHonorPostPut {
  honorID: string;
  status: string;
}
interface BulkAdd {
  pathfinderID: string;
  honors: PathfinderHonorPostPut[];
}

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
  post: (data: JSON) => {
    return axios.post(BASE_URL, data);
  },
  postPathfinderHonor: (id: string, data: JSON) => {
    return axios.post(BASE_URL + `/${id}/PathfinderHonors`, data);
  },
  putPathfinderHonor: (id: string, honorid: string, data: JSON) => {
    return axios.put(BASE_URL + `/${id}/PathfinderHonors/${honorid}`, data);
  },
  bulkAddPathfinderHonors: (data: BulkAdd[]) => {
    const response = axios
      .post(BASE_URL + "/PathfinderHonors", data)
      .then((res: AxiosResponse) => {
        return res;
      });
    return response;
  },
};
