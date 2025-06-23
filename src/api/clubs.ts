import axios from "axios";
import type { AxiosResponse } from "axios";
import { Errors } from "../errors/errors";
import { API_CONFIG } from "../config/api";

export default {
  getClub: (params = {}) => {
    return axios.get(API_CONFIG.BASE_URL + `/Clubs`, {
      params,
    });
  },
};
