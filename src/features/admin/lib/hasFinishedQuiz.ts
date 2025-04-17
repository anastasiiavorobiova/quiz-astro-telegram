export type QuizResult = [string, string] | [null, null];

export const hasFinishedQuiz = (
  quizResult: QuizResult,
): quizResult is [string, string] => {
  return Boolean(quizResult[0]) && Boolean(quizResult[1]);
};
