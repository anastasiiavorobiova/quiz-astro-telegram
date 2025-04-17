import { Question, QuestionChoice } from "./schema";
import { db } from "./db";

async function main() {
  const questions = [
    {
      question: "What is your favorite color?",
      choices: ["red", "blue", "yellow", "green"],
    },
    {
      question: "Your best trait is?",
      choices: ["kindness", "curiosity", "justice", "intelligence"],
    },
    {
      question: "People would describe you as",
      choices: ["active", "strong", "emotional", "brave"],
    },
    {
      question: "Your guilty pleasure is",
      choices: ["food", "romance", "planning murder", "fighting social issues"],
    },
    {
      question: "Your sense of humor is",
      choices: ["stupid", "dry", "smart", "sarcastic"],
    },
  ];

  questions.forEach(async ({ question, choices }) => {
    const result = await db
      .insert(Question)
      .values({ question })
      .returning({ id: Question.id });

    await db.insert(QuestionChoice).values({
      choice1: choices[0],
      choice2: choices[1],
      choice3: choices[2],
      choice4: choices[3],
      questionId: result[0].id,
    });
  });
}

main();
