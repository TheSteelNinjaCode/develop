import axios from "axios";
import { env } from "../config/env";

const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: "Client-ID " + env.UNSPLASH_ACCESS_KEY,
  },
});

export const searchImages = async (
  query: string,
  page: number = 1,
  perPage: number = 12
) => {
  try {
    const response = await unsplashApi.get("/search/photos", {
      params: { query, page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch images from Unsplash");
  }
};
