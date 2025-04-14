import { type InputHTMLAttributes, forwardRef } from "react";

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
      <div className={`flex flex-col ${className}`}>
        {label && <label className="block mb-2">{label}</label>}
        <div className="relative">
          <input
            {...inputOther}
            type={type}
            placeholder={placeholder}
            className={`input ${error && "border-red-600 focus:border-red-600"} ${touched && !error && "border-teal-500 focus:border-teal-500"}`}
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
