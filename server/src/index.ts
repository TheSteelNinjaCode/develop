import { appRouter } from "./routers";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./context";
import swaggerDocs from "./utils/swagger";
import routesDocs from "./routers/routes.docs";
dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({ origin: "*" }));
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const PORT = process.env.PORT || 3333; // Use PORT instead of SERVER
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
  routesDocs(app);
  swaggerDocs(app, PORT);
});

export default app;
export type AppRouter = typeof appRouter;
