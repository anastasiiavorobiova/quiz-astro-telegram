import type {
  SelectQuestion,
  SelectQuestionChoice,
  SelectAnswer,
} from "@/schema";
import { Toast } from "@/shared/ui";
import { actions } from "astro:actions";
import { useState } from "react";

type Props = {
  questions: Array<{
    questions: SelectQuestion;
    questions_choices: SelectQuestionChoice;
  }>;
};

export function Quiz({ questions }: Props) {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage(`Error ${error.status}: Cant't send your quiz results`);

      return;
    }

    if (!error && data) {
      setMessage(`${data.data.message}.`);
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
          disabled={isNextDisabled || Boolean(message) || Boolean(errorMessage)}
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
      {message && (
        <Toast status="success" className="w-full mt-8">
          {message}
        </Toast>
      )}
      {errorMessage && (
        <Toast status="error" className="w-full mt-8">
          {errorMessage}
        </Toast>
      )}
    </div>
  );
}
