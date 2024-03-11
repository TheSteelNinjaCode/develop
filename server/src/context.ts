import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./lib/prisma";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { env } from "./config/env";
import { UserSchema } from "./models/models";

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  // console.log(
  //   "🚀 ~ file: context.ts:12 ~ authorization:",
  //   req.headers.authorization
  // );
  if (!req.headers.authorization) {
    return { req, res, user: null };
  } else {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer <token>"
    // console.log("🚀 ~ file: context.ts:19 ~ token:", token);
    if (token === "undefined") {
      return { req, res, user: null };
    }
    try {
      // Verify the JWT
      const decoded = jwt.verify(token, env.JWT_SECRET_KEY); // Replace with your actual secret key

      const userShape = UserSchema.safeParse(decoded);
      if (!userShape.success) {
        return { req, res, user: null };
      }
      const user = userShape.data;

      // Fetch user details from the database using the userId
      const userFound = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userFound) {
        return { user: null };
      } else {
        return { req, res, user: userFound };
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Token is expired
        // Optionally, fetch the user based on the expired token's payload if necessary
        // For simplicity, I'm assuming the payload contains the user's ID
        try {
          const decoded = jwt.decode(token); // Decode without verification
          const userShape = UserSchema.safeParse(decoded);
          if (!userShape.success) {
            return { req, res, user: null };
          }

          const user = userShape.data;
          const userFound = await prisma.user.findUnique({
            where: { id: user.id },
          });

          if (!userFound) {
            console.error("User not found.");
            return { req, res, user: null };
          }

          // Generate a new token
          const newToken = jwt.sign({ id: userFound.id }, env.JWT_SECRET_KEY, {
            expiresIn: "1h", // Adjust the expiration as necessary
          });

          // Optionally, set the new token in the response headers or return it in another way
          res.setHeader("Authorization", `Bearer ${newToken}`);

          return { req, res, user: userFound, newToken }; // Include the newToken in the return object
        } catch (innerError) {
          console.error("Failed to generate new token:", innerError);
          return { req, res, user: null };
        }
      } else {
        console.error("JWT verification failed:", error);
        return { req, res, user: null };
      }
    }
  }
};
