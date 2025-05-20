import axios from "axios";
import { apiUrl } from "./globalConstants.ts";

const axiosApi = axios.create({
  baseURL: apiUrl,
});

axiosApi.defaults.withCredentials = true;

export default axiosApi;
