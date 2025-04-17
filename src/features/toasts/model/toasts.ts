import { atom } from "nanostores";

export type ToastStatus = "error" | "success";

export type TToast = null | {
  message: string;
  status: ToastStatus;
};

export const toastStore = atom<TToast>(null);
