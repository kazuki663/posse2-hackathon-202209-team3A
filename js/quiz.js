"use strict";

const quizListingPath = "../quiz_listing.json";

const url = new URL(window.location.href);

const personName = url.searchParams.get("person_name");
const quizName = url.searchParams.get("quiz_name");

(async () => {
  return await (await fetch(quizListingPath)).json();
})().then((json) => {
  const people = json.children;

  const person = people.find((person) => person.name == personName);
  const quiz = person?.children.find((quiz) => quiz.name == quizName);
  if (!quiz) {
    window.location.assign("./../index.html");
    throw new Error("enough parameter not specified");
  }

  fetch("../" + quiz.file)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      setupQuiz(json, 0);
    });
});

let score = 0;

const setupQuiz = (quizzes, index) => {
  const number = document.getElementById("js-number");
  number.textContent = `Q.${index + 1}`;

  const question = document.getElementById("js-question");
  question.textContent = quizzes[index].question;

  const choices = document.getElementById("js-choices");
  const choiceTemplate = document.getElementById("js-templ-choice");
  choices.innerHTML = "";
  quizzes[index].choices.forEach((choiceData, i) => {
    const choice = choiceTemplate.cloneNode(true);
    choice.removeAttribute("id");
    choice.classList.remove("u-hidden");
    const id = String.fromCharCode("A".charCodeAt() + i);
    choice.querySelector(".js-id").textContent = id;
    choice.querySelector(".js-text").textContent = choiceData;
    choices.append(choice);

    choice.addEventListener("click", () => {
      if (quizzes[index].answer === choiceData) {
        score++;
      }
      if (index + 1 < quizzes.length) {
        setupQuiz(quizzes, index + 1);
      } else {
        finishQuiz(quizzes, score);
      }
    });
  });
};

const finishQuiz = (quizzes, score) => {
  const quizResultPath = "./result/index.html";
  console.log(
    `${quizResultPath}?person_name=${personName}&quiz_name=${quizName}&level=${Math.floor(
      score / quizzes.length
    )}`
  );
  window.location.assign(
    `${quizResultPath}?person_name=${personName}&quiz_name=${quizName}&level=${Math.floor(
      (score / quizzes.length) * 100
    )}`
  );
};
