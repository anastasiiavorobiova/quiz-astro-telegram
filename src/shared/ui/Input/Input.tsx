import { type InputHTMLAttributes, forwardRef } from "react";
import classnames from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  className?: string;
  touched?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => {
    const {
      label = "",
      error = "",
      type = "text",
      placeholder = "",
      className = "",
      touched = false,
      ...inputOther
    } = props;

    return (
      <div className={classnames("flex flex-col", className)}>
        {label && <label className="block mb-2">{label}</label>}
        <div className="relative">
          <input
            {...inputOther}
            type={type}
            placeholder={placeholder}
            className={classnames("input", {
              ["border-red-600"]: error,
              ["focus:border-red-600"]: error,
              ["border-teal-500 "]: touched && !error,
              ["focus:border-teal-500"]: touched && !error,
            })}
            ref={ref}
            autoComplete="off"
          />
        </div>

        <p className="h-7 text-[14px] flex items-center leading-3 text-red-600">
          {error}
        </p>
      </div>
    );
  },
);

Input.displayName = "Input";
