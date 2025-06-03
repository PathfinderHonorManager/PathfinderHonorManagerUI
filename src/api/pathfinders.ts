import axios from "axios";
import type { AxiosResponse } from "axios";
import {
  PathfinderPost,
  PathfinderHonorPostPut,
  BulkAdd,
  ValidationError,
} from "@/models/pathfinder";

const BASE_URL =
  "https://pathfinderhonormanager.azurewebsites.net/api/pathfinders";

interface BulkUpdatePathfinder {
  pathfinderId: string;
  grade: number | null;
  isActive: boolean;
}

interface BulkUpdateRequest {
  items: BulkUpdatePathfinder[];
}

interface BulkUpdateResponse {
  status: number;
  pathfinderId: string;
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
  post: async (data: PathfinderPost) => {
    try {
      const response = await axios.post(BASE_URL, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errors = error.response.data.errors;
        if (errors) {
          throw new ValidationError(errors);
        }
      }
      throw error;
    }
  },
  async postPathfinder(data: PathfinderPost) {
    return await this.post(data);
  },
  async postPathfinderHonor(
    pathfinderID: string,
    postData: PathfinderHonorPostPut,
  ) {
    return await axios.post(
      BASE_URL + `/${pathfinderID}/PathfinderHonors`,
      postData,
    );
  },
  putPathfinderHonor: (
    id: string,
    honorid: string,
    data: PathfinderHonorPostPut,
  ) => {
    return axios.put(BASE_URL + `/${id}/PathfinderHonors/${honorid}`, data);
  },
  bulkManagePathfinderHonors: (data: BulkAdd[], action: "plan" | "earn" | "award") => {
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
        if (errors) {
          throw new ValidationError(errors);
        }
      }
      throw error;
    }
  },
  bulkUpdatePathfinders: (data: { items: any[] }) => {
    return axios.put<BulkUpdateResponse[]>(BASE_URL, data).then((res) => {
      if (res.status === 207) {
        // Check if any updates failed
        const failedUpdates = res.data.filter(update => update.status !== 200);
        if (failedUpdates.length > 0) {
          throw new Error(`Failed to update ${failedUpdates.length} pathfinders`);
        }
      }
      return res;
    });
  },
};
