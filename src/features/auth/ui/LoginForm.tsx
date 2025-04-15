import { actions } from "astro:actions";
import { useForm } from "react-hook-form";
import { loginSchema, type TLoginSchema } from "../model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Toast } from "@/shared/ui";
import { useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage(`Error ${error.status}: Cant't login a user`);

      return;
    }

    if (!error && data) {
      setMessage(`${data.data.message}.`);

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
      {message && (
        <Toast status="success" className="w-full mt-8">
          {message}
        </Toast>
      )}
      {errorMessage && (
        <Toast status="error" className="w-full mt-8">
          {errorMessage}
        </Toast>
      )}
    </form>
  );
}
