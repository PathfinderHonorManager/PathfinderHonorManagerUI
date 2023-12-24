import axios from "axios";
import type { AxiosResponse } from "axios";
import { Errors } from "../errors/errors";
import {
  Pathfinder,
  PathfinderPost,
  PathfinderHonors,
  PathfinderHonorPostPut,
  BulkAdd,
  BulkAddResponse,
  status,
} from "@/models/pathfinder";

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
  post: (data: PathfinderPost) => {
    return axios.post(BASE_URL, data);
  },
  async postPathfinder(data: PathfinderPost) {
    try {
      await this.post(data);
    } catch (err) {
      console.error(`Can't post this pathfinder because: ${err}`);
    } finally {
      await this.getAll();
      this.loading = false;
    }
  },
  async postPathfinderHonor(pathfinderID: string, postData: string) {
    this.loading = true;
    this.error = false;
    try {
      await axios.post(
        BASE_URL + `/${pathfinderID}/PathfinderHonors`,
        postData
      );
    } catch (err) {
      this.error = true;
      console.error(`Could add honor, because: ${err}`);
    } finally {
      this.loading = false;
    }
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
