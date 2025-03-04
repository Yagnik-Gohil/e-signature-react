import apiHelper from "./apiHelper";
import axiosInstance from "./axiosInstance";

export const uploadFile = async (file: File, folder: string, title: string) => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("folder", folder);
  formData.append("title", title);

  return apiHelper(
    axiosInstance.post(`/upload/document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};
