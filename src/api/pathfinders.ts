import axios from "axios";
import type { AxiosResponse } from "axios";
import {
  PathfinderPost,
  PathfinderHonorPostPut,
  BulkAdd,
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
  async postPathfinderHonor(
    pathfinderID: string,
    postData: PathfinderHonorPostPut,
  ) {
    this.loading = true;
    this.error = false;
    try {
      await axios.post(
        BASE_URL + `/${pathfinderID}/PathfinderHonors`,
        postData,
      );
    } catch (err) {
      this.error = true;
      console.error(`Could add honor, because: ${err}`);
    } finally {
      this.loading = false;
    }
  },
  putPathfinderHonor: (
    id: string,
    honorid: string,
    data: PathfinderHonorPostPut,
  ) => {
    return axios.put(BASE_URL + `/${id}/PathfinderHonors/${honorid}`, data);
  },
  bulkManagePathfinderHonors: (data: BulkAdd[], action: "plan" | "earn") => {
    const method = action === "plan" ? axios.post : axios.put;
    return method(BASE_URL + "/PathfinderHonors", data).then(
      (res: AxiosResponse) => {
        return res;
      },
    );
  },
  putPathfinder: async (
    pathfinderID: string,
    data: { grade: number | null; isActive: boolean | null },
  ) => {
    try {
      const response = await axios.put(`${BASE_URL}/${pathfinderID}`, data);
      if (response.status !== 200) {
        throw new Error(`API responded with status code ${response.status}`);
      }
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errors = error.response.data.errors;
        const errorMessages = Object.keys(errors)
          .map((key) => `${key}: ${errors[key].join(", ")}`)
          .join("\n");
        throw new Error(`Validation error: ${errorMessages}`);
      }
      throw error; // Pass the error response up the stack
    }
  },
};
