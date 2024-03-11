import { publicProcedure, router } from "../trpc";
import { prisma } from "../lib/prisma";
import { string, z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ThrowError } from "../lib/errorHandler";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { SignupSchema, User } from "../models/models";

export const userRouter = router({
  create: publicProcedure.input(SignupSchema).mutation(async (opts) => {
    try {
      const { name, email, password } = opts.input;
      if (email) {
        const userFound = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (userFound) {
          ThrowError(Error, "BAD_REQUEST", "El email ya existe", "user.email");
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const createUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: passwordHash,
        },
      });

      return createUser;
    } catch (error) {
      ThrowError(error);
    }
  }),
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string().min(3) }))
    .mutation(async (opts) => {
      try {
        const { email, password } = opts.input;
        const userFound = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!userFound) {
          ThrowError(Error, "NOT_FOUND", "El usuario no existe");
          return;
        }

        const compareResult = await bcrypt.compare(
          password,
          userFound.password ?? ""
        );

        if (!compareResult) {
          ThrowError(Error, "NOT_FOUND", "La contraseña es incorrecta");
          return;
        }

        const userToken = {
          id: userFound.id,
          email: userFound.email,
        };

        const token = await new Promise((resolve, reject) => {
          jwt.sign(
            userToken,
            env.JWT_SECRET_KEY,
            {
              expiresIn: "1d",
            },
            (err, token) => {
              if (err) {
                reject(new Error("Error al obtener el usuario"));
              } else {
                resolve(token);
              }
            }
          );
        });

        if (!token) {
          ThrowError(
            Error,
            "INTERNAL_SERVER_ERROR",
            "Error al obtener el token"
          );
        }

        const userToReturn = {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email,
        };

        return {
          token: token as string,
          user: userToReturn,
        };
      } catch (error) {
        console.log("🚀 ~ .mutation ~ error:", error);
        ThrowError(error);
      }
    }),
  logout: publicProcedure
    .input(
      z.object({
        token: string(),
      })
    )
    .mutation(async (opts) => {
      console.log("🚀 ~ .mutation ~ opts:", opts);
      try {
        const verifyJwt = jwt.verify(opts.input.token, env.JWT_SECRET_KEY);
        if (!verifyJwt) {
          ThrowError(Error, "UNAUTHORIZED", "No autorizado");
        }

        return {
          message: "Sesión cerrada",
        };
      } catch (error) {
        console.log("🚀 ~ .mutation ~ error:", error);
        ThrowError(error);
      }
    }),
  lostPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async (opts) => {
      try {
        const { email } = opts.input;
        const userFound = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!userFound) {
          ThrowError(Error, "NOT_FOUND", "El usuario no existe", "id");
          return;
        } else if (!userFound.email) {
          ThrowError(
            Error,
            "NOT_FOUND",
            "El usuario no tiene un email asociado",
            "email"
          );
          return;
        }

        // Create a transporter using Gmail service and your App Password
        const transporter = nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE, // true for 465, false for other ports
          auth: {
            user: env.SMTP_USER, // Your Gmail address
            pass: env.SMTP_PASSWORD, // The App Password you generated
          },
        });

        // Email options
        const mailOptions = {
          from: env.SMTP_USER, // Sender address
          to: userFound.email, // List of recipients
          subject: "Lostpassword", // Subject line
          text: "Recover password message", // Plain text body
        };

        // Wrap sendMail in a promise
        const sendMailPromise = () => {
          return new Promise<{ message: string; userInfo: User }>(
            (resolve, reject) => {
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  reject({ message: "Error al enviar email", error: true });
                  ThrowError(
                    Error,
                    "INTERNAL_SERVER_ERROR",
                    "Error al enviar email"
                  );
                } else {
                  console.log("Email sent:", info.response);
                  resolve({ message: "Email enviado", userInfo: userFound });
                }
              });
            }
          );
        };

        // Use the promise
        const infoToReturn = await sendMailPromise();
        const userInfoToReturn = {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email,
          message: infoToReturn.message,
        };
        return userInfoToReturn;
      } catch (error) {
        console.log("🚀 ~ file: users.ts:95 ~ .query ~ error:", error);
        ThrowError(error);
      }
    }),
});
