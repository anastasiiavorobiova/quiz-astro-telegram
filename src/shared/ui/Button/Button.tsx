import type { ButtonHTMLAttributes } from "react";
import classnames from "classnames";

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
      className={classnames("btn", className)}
      {...other}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
