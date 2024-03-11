import { router } from "../trpc";
import { fileRouter } from "./file";
import { unsplashRouter } from "./unsplash";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  file: fileRouter,
  unspalsh: unsplashRouter,
});
