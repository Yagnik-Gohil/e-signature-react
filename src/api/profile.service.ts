import axiosInstance from "./axiosInstance";
import apiHelper from "./apiHelper";

export const updateProfile = async (data: { name: string }) => {
  return apiHelper(axiosInstance.patch("/user/profile", data), true);
};

export const getProfile = async () => {
  return apiHelper(axiosInstance.get("/user/profile"));
};
