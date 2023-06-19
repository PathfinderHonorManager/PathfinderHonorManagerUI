import axios from "axios";
import type { AxiosResponse } from "axios";
import { Errors } from "../errors/errors";

const BASE_URL = "https://pathfinderhonormanager.azurewebsites.net/api";

export default {
  getClub: (params = {}) => {
    return axios.get(BASE_URL + `/Clubs`, {
      params,
    });
  },
};
