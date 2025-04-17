import { useEffect } from "react";
import classnames from "classnames";
import { useStore } from "@nanostores/react";
import { toastStore } from "../model";

type Props = {
  className?: string;
};

export function Toast({ className = "" }: Props) {
  const toast = useStore(toastStore);

  useEffect(() => {
    const timerId = setTimeout(() => {
      toastStore.set(null);
    }, 5000);

    return () => clearTimeout(timerId);
  }, []);

  if (!toast) {
    return null;
  }

  return (
    <div
      className={classnames(
        "border p-4 right-8 my-16",
        {
          ["text-red-600"]: toast.status === "error",
          ["text-teal-600"]: toast.status === "success",
        },
        className,
      )}
    >
      {toast.message}
    </div>
  );
}
