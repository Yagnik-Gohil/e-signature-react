import { IDocuments, IAddSignatureBox } from "@/types";
import apiHelper from "./apiHelper";
import axiosInstance from "./axiosInstance";

export const getDocuments = async (
  limit: number = 10,
  offset: number = 0
): Promise<{
  status: number;
  message: string;
  total: number;
  limit: number;
  offset: number;
  data: IDocuments[];
}> => {
  return apiHelper(
    axiosInstance.get("/user-document/document", {
      params: {
        limit,
        offset,
      },
    })
  );
};

export const getDocumentById = async (
  id: string
): Promise<{
  status: number;
  message: string;
  data: IDocuments;
}> => {
  return apiHelper(axiosInstance.get(`/document/${id}`));
};

export const saveSignatureBoxes = async (
  data: IAddSignatureBox
): Promise<{ status: number; message: string; data: IDocuments }> => {
  return apiHelper(axiosInstance.post("user-document/signature-boxes", data));
};
