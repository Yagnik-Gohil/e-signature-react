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
    }),
    true
  );
};

export const uploadSignature = async (
  signature: File,
  document: string,
  next_user?: string
) => {
  const formData = new FormData();
  formData.append("signature", signature);
  formData.append("document", document);
  if (next_user) {
    formData.append("next_user", next_user);
  }

  return apiHelper(
    axiosInstance.post(`/upload/signature`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
    true
  );
};
