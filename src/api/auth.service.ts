import axiosInstance from "./axiosInstance";
import apiHelper from "./apiHelper";

export const signup = async (credentials: {
  name: string;
  email: string;
  password: string;
  device_id: string;
}) => {
  return apiHelper(axiosInstance.post("/auth/signup", credentials), true);
};

export const login = async (credentials: {
  email: string;
  password: string;
  device_id: string;
}) => {
  return apiHelper(axiosInstance.post("/auth/login", credentials), true);
};

export const logout = async () => {
  return apiHelper(axiosInstance.post("/auth/logout"), true);
};
