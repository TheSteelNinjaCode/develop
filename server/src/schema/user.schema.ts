import { z } from "zod";

/**
 * @openapi
 *  components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *        - email
 *        - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           default: "john.doe@example.com"
 *         password:
 *           type: string
 *           default: "123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjY2VzcyIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIn0"
 *           description: JWT token containing the user's id and email
 *         user:
 *           type: object
 *           properties: # Added missing 'properties' key here
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *               default: "John Doe"
 *             email:
 *               type: string
 *               format: email
 */
export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email().nullable(),
    password: z.string().nullable(),
  }),
});
export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateUserInput:
 *    type: object
 *    required:
 *     - name
 *     - email
 *     - password
 *    properties:
 *     name:
 *       type: string
 *       default: "John Doe"  # Correctly quote the default value
 *     email:  # Adding missing properties to match the Zod schema
 *       type: string
 *       description: Must be unique.
 *       default: "john.doe@example.com"
 *     password:
 *       type: string
 *       default: "123"
 *   CreateUserResponse:
 *    type: object
 *    properties:
 *     id:
 *       type: string
 *       format: uuid
 *     name:
 *       type: string
 *       default: "John Doe"
 *     email:
 *      type: string
 *      format: email
 *      default: "john.doe@example.com"
 *     password:
 *      type: string
 *      default: "$2b$10$tHfms9XxkV4e6d54Twdrm.jqpG7XfRKV8iD7phf1DCdguFVyHqy4G"
 */
export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string().nullable(),
    email: z.string().email().nullable(),
    password: z.string().nullable(),
  }),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

/**
 * @openapi
 * components:
 *  schemas:
 *   LostPasswordInput:
 *    type: object
 *    required:
 *    - email
 *    properties:
 *     email:
 *       type: string
 *       format: email
 *       default: "john.doe@gmail.com"
 *   LostPasswordResponse:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      format: uuid
 *     name:
 *      type: string
 *      default: "John Doe"
 *     email:
 *      type: string
 *      format: email
 *     message:
 *       type: string
 *       default: "Password reset link sent."
 */
export const LostPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});
export type LostPasswordInput = z.infer<typeof LostPasswordSchema>;
