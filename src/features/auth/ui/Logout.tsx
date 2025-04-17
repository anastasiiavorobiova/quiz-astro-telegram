import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { toastStore } from "@/features/toasts";
import { Button } from "@/shared/ui";

type Props = {
  redirectUrl: string;
};

export function Logout({ redirectUrl }: Props) {
  const logoutUser = async () => {
    const { error, data } = await actions.auth.logout();

    if (error) {
      toastStore.set({
        message: `Error ${error.status}: Something went wrong`,
        status: "error",
      });

      return;
    }

    if (!error && data) {
      navigate(redirectUrl);
    }
  };

  return <Button onClick={logoutUser}>Log out</Button>;
}
