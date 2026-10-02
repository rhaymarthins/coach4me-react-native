import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.100:3333",
  timeout: 10000,
});

export default api;
