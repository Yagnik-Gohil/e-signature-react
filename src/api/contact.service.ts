import { IContacts } from "@/types";
import apiHelper from "./apiHelper";
import axiosInstance from "./axiosInstance";

export const getContacts = async (
  limit: number = 10,
  offset: number = 0
): Promise<{
  status: number;
  message: string;
  total: number;
  limit: number;
  offset: number;
  data: IContacts[];
}> => {
  return apiHelper(
    axiosInstance.get("/contact", {
      params: {
        limit,
        offset,
      },
    })
  );
};

export const createContact = async (data: {
  email: string;
  recipient_name: string;
}): Promise<{
  status: number;
  message: string;
}> => {
  return apiHelper(axiosInstance.post("/contact", data), true);
};

export const editContact = async (
  id: string,
  data: {
    email: string;
    recipient_name: string;
  }
): Promise<{
  status: number;
  message: string;
}> => {
  return apiHelper(axiosInstance.patch(`/contact/${id}`, data), true);
};
