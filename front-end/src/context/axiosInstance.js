import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request:", config);

    config.cache = "force-cache";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
