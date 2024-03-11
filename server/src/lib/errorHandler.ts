import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

/**
 * Description placeholder
 *
 * @param {unknown} [error=new Error("An unknown error occurred")]
 * @param {TRPC_ERROR_CODE_KEY} [code="INTERNAL_SERVER_ERROR"]
 * @param {string} [message="An error occurred"]
 * @param {string} [inputPath]
 * @returns {void}
 * @example
 * ThrowError()
 * @example
 * ThrowError(new Error("An unknown error occurred"))
 * @example
 * ThrowError(new Error("An unknown error occurred"), "INTERNAL_SERVER_ERROR")
 * @example
 * ThrowError(new Error("An unknown error occurred"), "INTERNAL_SERVER_ERROR", "An error occurred")
 * @example
 * ThrowError(new Error("An unknown error occurred"), "INTERNAL_SERVER_ERROR", "An error occurred", "An error occurred")
 **/
export const ThrowError = (
  error: unknown = new Error("An unknown error occurred"),
  code: TRPC_ERROR_CODE_KEY = "INTERNAL_SERVER_ERROR",
  message: string = "An error occurred",
  inputPath?: string,
): void => {
  let errorMessage: string;

  if (error instanceof Error) {
    errorMessage = message || error.message;
  } else {
    errorMessage = inputPath ? JSON.stringify({ inputPath, message }) : message;
  }

  throw new TRPCError({
    code,
    message: errorMessage,
  });
};
