import { useEffect, useState, type ReactNode } from "react";
import classnames from "classnames";

export type ToastStatus = "error" | "success";

type Props = {
  status?: ToastStatus;
  className?: string;
  children?: ReactNode;
};

export function Toast({ children, status, className }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsOpen(false);
    }, 5000);

    return () => clearTimeout(timerId);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={classnames(
        "border p-4 right-8",
        {
          ["text-red-600"]: status === "error",
          ["text-teal-600"]: status === "success",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
