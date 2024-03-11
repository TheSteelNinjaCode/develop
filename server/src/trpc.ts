import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { createContext } from "./context";

const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create({});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.req?.headers.authorization) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No autorizado" });
  }
  return next({ ctx: { ...ctx } });
});

export const adminProcedure = t.procedure.use(protectedMiddleware);
