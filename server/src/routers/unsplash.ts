import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { ThrowError } from "../lib/errorHandler";
import { searchImages } from "../service/unsplash.service";
import { UnsplashImage } from "../models/models";

export const unsplashRouter = router({
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().optional(),
        perPage: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { query, page = 1, perPage = 12 } = input;
        const unsplashImages = await searchImages(query, page, perPage);
        const unsplashImagesTyped: UnsplashImage[] =
          await unsplashImages.results.map((image: any) => {
            return {
              id: image.id,
              description: image.description || image.alt_description,
              url: image.urls.regular,
              width: image.width,
              height: image.height,
              type: image.type,
            };
          });

        return unsplashImagesTyped;
      } catch (error) {
        ThrowError(error);
      }
    }),
});
