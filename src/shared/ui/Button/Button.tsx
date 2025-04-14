import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "button" | "reset" | "submit";
  className?: string;
  onClick?: () => void;
}

export function Button({
  type = "button",
  className = "",
  onClick = () => {},
  children,
  ...other
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      {...other}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
