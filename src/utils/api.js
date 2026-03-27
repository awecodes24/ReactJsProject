import axios from "axios";

const BASE_URL = "https://687af3bbabb83744b7ee4a18.mockapi.io/blogs";

const api = axios.create({ baseURL: BASE_URL });

export const blogApi = {
  getAll: () => api.get("/"),
  getOne: (id) => api.get(`/${id}`),
  create: (data) => api.post("/", data),
  update: (id, data) => api.put(`/${id}`, data),
  delete: (id) => api.delete(`/${id}`),
};

export default api;
