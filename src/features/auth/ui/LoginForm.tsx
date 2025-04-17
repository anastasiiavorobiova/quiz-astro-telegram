import { useEffect } from "react";
import { navigate } from "astro:transitions/client";
import { actions } from "astro:actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastStore } from "@/features/toasts";
import { Button, Input } from "@/shared/ui";
import { loginSchema, type TLoginSchema } from "../model";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isSubmitSuccessful },
    reset,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (userData: TLoginSchema) => {
    const { error, data } = await actions.auth.loginUser({
      ...userData,
    });

    if (error) {
      toastStore.set({
        message: `Error ${error.status}: Cant't login a user`,
        status: "error",
      });

      return;
    }

    if (!error && data) {
      toastStore.set({
        message: `${data.data.message}.`,
        status: "success",
      });

      navigate("/", { history: "replace" });
    }
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="signinForm">
      <Input
        {...register("email")}
        error={errors.email ? errors.email.message : ""}
        type="email"
        placeholder="Email"
        touched={touchedFields.email}
        className="mb-3"
        disabled={isSubmitting}
      />

      <Input
        {...register("password")}
        type="password"
        error={errors.password ? errors.password.message : ""}
        placeholder="Password"
        touched={touchedFields.password}
        className="mb-3"
        disabled={isSubmitting}
      />

      <div className="text-right">
        <Button disabled={isSubmitting} type="submit">
          Login
        </Button>
      </div>
    </form>
  );
}
