import { Express } from "express";
import validateResource from "../middleware/validateResource";
import { UserSchema } from "../models/models";

export default function routesDocs(app: Express) {
  /**
   * @openapi
   * '/trpc/user.login':
   *   post:
   *     tags:
   *       - User
   *     summary: Login a user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginInput'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       409:
   *         description: Conflict
   *       400:
   *         description: Bad request
   */
  app.post("/trpc/user.login", validateResource(UserSchema));

  /**
   * @openapi
   * '/trpc/user.create':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/trpc/user.create", validateResource(UserSchema));

  /**
   * @openapi
   * '/trpc/user.lostPassword':
   *  post:
   *     tags:
   *     - User
   *     summary: Lost password
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/LostPasswordInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LostPasswordResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/trpc/trpc/user.lostPassword", validateResource(UserSchema));
}
