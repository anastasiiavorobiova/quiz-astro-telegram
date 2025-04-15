import { actions } from "astro:actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Toast } from "@/shared/ui";
import { signUpSchema, type TSignUpSchema } from "../model";
import { useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";

export function SignupForm() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isSubmitSuccessful },
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (userData: TSignUpSchema) => {
    const { error, data } = await actions.auth.createUser({
      ...userData,
    });

    if (error) {
      setErrorMessage(`Error ${error.status}: Cant't register a user`);

      return;
    }

    if (!error && data) {
      setMessage(
        `${data.data.message}. You will receive the email to confirm your account.`,
      );

      navigate("/", { history: "replace" });
    }
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="signupForm">
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
        placeholder="password"
        touched={touchedFields.password}
        className="mb-3"
        disabled={isSubmitting}
      />
      <Input
        {...register("confirmPassword")}
        error={errors.confirmPassword ? errors.confirmPassword.message : ""}
        type="password"
        placeholder="password"
        touched={touchedFields.confirmPassword}
        className="mb-3"
        disabled={isSubmitting}
      />

      <p>
        If you already have an account, you can login here{" "}
        <a href="/login" className="text-teal-500 underline">
          login
        </a>
      </p>

      <div className="text-right">
        <Button disabled={isSubmitting} type="submit">
          Signup
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
