import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/ui";
import { signUpSchema, type TSignUpSchema } from "../model";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (_userData: TSignUpSchema) => {
    reset();
  };

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
    </form>
  );
}
