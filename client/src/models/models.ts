import { z } from "zod";

const DateTime = z.coerce.date();
const Int = z.coerce.number().int();
const String = z.string();
const Boolean = z.boolean();

export const UserSchema = z.object({
  id: String,
  name: String.nullable(),
  email: String.nullable(),
  password: String.nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const LoginUserSchema = z.object({
  email: String,
  password: String.min(3),
});

export type LoginUser = {
  email: string;
  password: string;
};

export const SignupSchema = z.object({
  name: String,
  email: String,
  password: String.min(3),
});
export type Signup = z.infer<typeof SignupSchema>;
export const defaultSignUpValues: Signup = {
  name: "",
  email: "",
  password: "",
};

export const LostPasswordSchema = z.object({
  email: String,
});
export type LostPassword = z.infer<typeof LostPasswordSchema>;

export type ErrorResult<T> = {
  inputPath: keyof T;
  message: string;
};
