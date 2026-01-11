import axios from "axios";
import { API_CONFIG } from "../config/api";

export default {
  getClub: (params = {}) => {
    return axios.get(API_CONFIG.BASE_URL + `/Clubs`, {
      params,
    });
  },
};
