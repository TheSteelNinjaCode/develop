import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorResult, LoginUser, LoginUserSchema } from "../models/models";
import { useUserAuthStore } from "../stores/useAuthStore";
import { trpc } from "../trpc/client";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(LoginUserSchema),
  });
  const userAuthStore = useUserAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthStore?.userProfile?.id) {
      navigate("/dashboard");
    }
  }, [userAuthStore, navigate]);

  const loginUser = trpc.user.login.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Procesando...");
      return toastId;
    },
    onSuccess: (data, _, context) => {
      if (data) {
        userAuthStore?.updateToken(data.token);
        userAuthStore?.updateUserProfile(data.user);
      }
      toast.success("Inicio de sesión completo", {
        id: context,
      });
    },
    onError: (error, _, context) => {
      if (error instanceof Error)
        toast.error(error.message, {
          id: context,
        });

      const errorResult: ErrorResult<LoginUser> = JSON.parse(error.message);
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
  });

  const onSubmit = (data: LoginUser) => {
    loginUser.mutate(data);
  };

  return (
    <>
      <div className="grid w-screen h-screen place-items-center">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold mb-4">Llama a la Vida</h1>
          <form className="grid w-full gap-1" onSubmit={handleSubmit(onSubmit)}>
            <input
              className="rounded-xl border-slate-200 bg-[#eef5fa] p-3 text-base"
              type="text"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
            <input
              className="rounded-xl border-slate-200 bg-[#eef5fa] p-3 text-base"
              type="password"
              placeholder="Contraseña"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
            <button type="submit" className="btn bg-purple-700 text-white mt-4">
              Inicie sesión
            </button>
          </form>
          <p>
            Se te olvido la contraseña?{" "}
            <Link to="/lostpassword">Recuperar</Link>
          </p>
          <p className="mt-2">
            No tiene cuenta?{" "}
            <Link to="/signup" className="text-blue-500">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
