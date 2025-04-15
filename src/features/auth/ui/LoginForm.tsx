import { useForm } from "react-hook-form";
import { loginSchema, type TLoginSchema } from "../model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/ui";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (_userData: TLoginSchema) => {
    reset();
  };

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
