import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  ErrorResult,
  Signup,
  SignupSchema,
  defaultSignUpValues,
} from "../models/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trpc } from "../trpc/client";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<Signup>({
    defaultValues: defaultSignUpValues,
    resolver: zodResolver(SignupSchema),
  });

  const createUser = trpc.user.create.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Creating...");
      return toastId;
    },
    onSuccess: (data, _, context) => {
      toast.success(`${data?.name} created successfully`, {
        id: context,
      });
    },
    onError: (error, _, context) => {
      if (error instanceof Error)
        toast.error(error.message, {
          id: context,
        });

      const errorResult: ErrorResult<Signup> = JSON.parse(error.message);
      toast.error(errorResult.message, {
        id: context,
      });
      if (errorResult.inputPath) {
        setError(
          errorResult.inputPath,
          {
            type: "validate",
            message: errorResult.message,
          },
          {
            shouldFocus: true,
          }
        );
      }
    },
    onSettled: () => {
      // users.refetch();
    },
  });

  const onSubmit = async (data: Signup) => {
    await createUser.mutateAsync(data);
    reset();
  };

  return (
    <>
      <div className="grid place-items-center w-screen h-screen">
        <div>
          <h1 className="font-bold text-2xl mb-4">Registro</h1>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="p-2 border rounded-lg"
              type="text"
              placeholder="Nombre"
              {...register("name")}
            />
            {errors?.name && (
              <span className="text-red-500">{errors?.name.message}</span>
            )}
            <input
              className="p-2 border rounded-lg"
              type="email"
              placeholder="Correo"
              {...register("email")}
            />
            {errors?.email && (
              <span className="text-red-500">{errors?.email.message}</span>
            )}
            <input
              className="p-2 border rounded-lg"
              type="password"
              placeholder="Contraseña"
              {...register("password")}
            />
            {errors?.password && (
              <span className="text-red-500">{errors?.password.message}</span>
            )}
            <div>
              <button className="bg-blue-500 text-white w-full">
                Registrarse
              </button>
            </div>
          </form>
          <p className="mt-2">
            Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-500">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
