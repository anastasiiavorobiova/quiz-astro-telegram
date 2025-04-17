import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { useState } from "react";
import { toastStore } from "@/features/toasts";
import type {
  SelectQuestion,
  SelectQuestionChoice,
  SelectAnswer,
} from "@/schema";

type Props = {
  questions: Array<{
    questions: SelectQuestion;
    questions_choices: SelectQuestionChoice;
  }>;
};

export function Quiz({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[currentIndex],
  );
  const [answers, setAnswers] = useState<Partial<SelectAnswer>[]>([]);

  const isNextDisabled = currentIndex === answers.length;
  const lastIndex = questions.length - 1;

  const nextQuestion = () => {
    if (currentIndex < lastIndex) {
      const newIndex = currentIndex + 1;

      setCurrentIndex(newIndex);
      setCurrentQuestion(questions[newIndex]);
    }
  };

  const chooseAnswer = (answer: string) => {
    const newAnswers = [...answers];

    newAnswers[currentIndex] = {
      answer,
      choice_id: currentQuestion.questions_choices.id,
      questionId: currentQuestion.questions.id,
    };

    setAnswers(newAnswers);
  };

  const sendAnswers = async () => {
    const { error, data } = await actions.quiz.sendResults(answers);

    if (error) {
      toastStore.set({
        message: `Error ${error.status}: Cant't send your quiz results`,
        status: "error",
      });

      return;
    }

    if (!error && data) {
      toastStore.set({
        message: `${data.data.message}.`,
        status: "success",
      });

      navigate("/");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold capitalize tracking-wide mb-6">
        {currentQuestion.questions.question}
      </h2>
      <ul className="flex flex-col gap-6 mb-8">
        <li>
          <button
            type="button"
            className="btn w-full"
            onClick={() =>
              chooseAnswer(currentQuestion.questions_choices.choice1)
            }
            disabled={
              currentQuestion.questions_choices.choice1 ===
              answers[currentIndex]?.answer
            }
          >
            {currentQuestion.questions_choices.choice1}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="btn w-full"
            onClick={() =>
              chooseAnswer(currentQuestion.questions_choices.choice2)
            }
            disabled={
              currentQuestion.questions_choices.choice2 ===
              answers[currentIndex]?.answer
            }
          >
            {currentQuestion.questions_choices.choice2}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="btn w-full"
            onClick={() =>
              chooseAnswer(currentQuestion.questions_choices.choice3)
            }
            disabled={
              currentQuestion.questions_choices.choice3 ===
              answers[currentIndex]?.answer
            }
          >
            {currentQuestion.questions_choices.choice3}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="btn w-full"
            onClick={() =>
              chooseAnswer(currentQuestion.questions_choices.choice4)
            }
            disabled={
              currentQuestion.questions_choices.choice4 ===
              answers[currentIndex]?.answer
            }
          >
            {currentQuestion.questions_choices.choice4}
          </button>
        </li>
      </ul>
      {currentIndex === lastIndex ? (
        <button
          type="button"
          className="btn"
          disabled={isNextDisabled}
          onClick={sendAnswers}
        >
          finish
        </button>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={nextQuestion}
          disabled={isNextDisabled}
        >
          next
        </button>
      )}
    </div>
  );
}
