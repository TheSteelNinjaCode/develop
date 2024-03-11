import { useForm } from "react-hook-form";
import {
  ErrorResult,
  LostPassword,
  LostPasswordSchema,
} from "../models/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../trpc/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function LostPasswordPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LostPassword>({
    resolver: zodResolver(LostPasswordSchema),
  });

  const LostPassword = trpc.user.lostPassword.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Enviando...");
      return toastId;
    },
    onSuccess: (data, _, context) => {
      console.log("🚀 ~ file: page.tsx:26 ~ LostPassword ~ data:", data);
      toast.success(`Correo enviado a ${data?.email}`, {
        id: context,
      });
    },
    onError: (error, _, context) => {
      console.log("🚀 ~ file: page.tsx:32 ~ SingUp ~ error:", error);
      if (error instanceof Error)
        toast.error(error.message, {
          id: context,
        });

      const errorResult: ErrorResult<LostPassword> = JSON.parse(error.message);
      console.log(
        "🚀 ~ file: page.tsx:41 ~ SingUp ~ errorResult:",
        errorResult
      );
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

  const onSubmit = (data: LostPassword) => {
    LostPassword.mutate(data);
  };

  return (
    <>
      <div className="grid place-items-center w-screen h-screen">
        <div>
          <h1 className="font-semibold text-2xl mb-4">Lost Password</h1>
          <form className="flex gap-4 mb-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              className="input input-bordered input-sm w-full max-w-xs"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
            <button className="btn btn-sm btn-neutral">Send Email</button>
          </form>
          <Link to="/login">Inicia session </Link>
        </div>
      </div>
    </>
  );
}
