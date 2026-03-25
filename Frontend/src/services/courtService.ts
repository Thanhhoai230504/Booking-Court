import axiosPickleball from "../api/axiosPickleball";
import { Court } from "../types";

export const courtService = {
  getAvailableCourts: async (params?: {
    city?: string;
    date?: string;
    maxPrice?: number;
  }): Promise<Court[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.city) queryParams.append("city", params.city);
      if (params.date) queryParams.append("date", params.date);
      if (params.maxPrice)
        queryParams.append("maxPrice", params.maxPrice.toString());
    }
    const response = await axiosPickleball.get(
      `/courts/available?${queryParams.toString()}`,
    );
    return response.data;
  },

  getCourtById: async (id: string): Promise<Court> => {
    const response = await axiosPickleball.get(`/courts/${id}`);
    return response.data;
  },
};

export default courtService;
