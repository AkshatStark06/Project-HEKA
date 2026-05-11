import axios from "axios";

const hekaApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default hekaApi;