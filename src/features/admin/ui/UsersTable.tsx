import { toastStore } from "@/features/toasts";
import { Button } from "@/shared/ui";
import { actions } from "astro:actions";
import { useState } from "react";
import { hasFinishedQuiz, type QuizResult } from "../lib";

type Props = {
  usersMap: Map<string, QuizResult[]>;
};

export function UsersTable({ usersMap }: Props) {
  const [users, setUsers] = useState(usersMap);

  const deleteUser = async (userEmail: string) => {
    const { error, data } = await actions.admin.deleteUser(userEmail);

    if (error) {
      toastStore.set({
        message: `Error ${error.status}: Cant't delete a user`,
        status: "error",
      });

      return;
    }

    if (!error && data) {
      toastStore.set({
        message: `${data.data.message}.`,
        status: "success",
      });

      const newUsers = new Map(users);

      newUsers.delete(userEmail);
      setUsers(newUsers);
    }
  };

  return (
    <section>
      {Array.from(users.entries()).map(([email, userResults]) => {
        return (
          <article className="mb-10" key={email}>
            <div className="flex justify-between items-center border-b border-teal-500 py-4">
              <h3 className="text-teal-600 text-xl">{email}</h3>
              <Button onClick={() => deleteUser(email)}>Delete User</Button>
            </div>

            <ul>
              {userResults.map((result, i) => {
                if (hasFinishedQuiz(result)) {
                  const [question, answer] = result;

                  return (
                    <li className="flex gap-6 my-2" key={i}>
                      <p className="capitalize">{question}</p>
                      <p className="capitalize text-slate-500">{answer}</p>
                    </li>
                  );
                }

                return null;
              })}
            </ul>
          </article>
        );
      })}
    </section>
  );
}
