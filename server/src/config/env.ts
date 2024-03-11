import { z } from "zod";
import "dotenv/config";

// Define the schema for your environment variables
const envSchema = z.object({
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z.coerce.boolean(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),

  JWT_SECRET_KEY: z.string(),
  UPDATE_JWT_SECRET_KEY: z.string(),

  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),

  UNSPLASH_APPLICATION_ID: z.string(),
  UNSPLASH_ACCESS_KEY: z.string(),
  UNSPLASH_SECRET_KEY: z.string(),
});

// Load environment variables from process.env and validate them
export const env = envSchema.parse(process.env);
