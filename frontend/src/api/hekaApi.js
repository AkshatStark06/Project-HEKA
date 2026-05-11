import axios from "axios";

const hekaApi = axios.create({
  /*baseURL: import.meta.env.VITE_API_URL,*/
  baseURL: "http://localhost:8000"
});

export default hekaApi;