let player1 = "";
let player2 = "";
let player1Score = 0;
let player2Score = 0;

const start = (event) => {
  if (event.target.className === "firstStart") {
    if (
      document.getElementById("first").value &&
      document.getElementById("second").value
    ) {
      player1 = document.getElementById("first").value;
      player2 = document.getElementById("second").value;
    } else {
      player1 = "player1";
      player2 = "player2";
      // alert('Enter Player Names to Continue...')
      // return;
    }

    input.style.display = "none";
    category.style.display = "block";

    ApiFetch().then((data) => insertCategoryList(data));
  }
};

const input = document.getElementById("start");
input.addEventListener("click", start);

const ApiFetch = async () => {
  try {
    const values = await fetch("https://the-trivia-api.com/v2/questions");
    if (!values.ok) {
      throw new Error("API Fetch Error");
    } else {
      const data = await values.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const categoryList = [];
let selectedCategory = "";

const insertCategoryList = (values) => {
  for (i = 0; i < values.length; i++) {
    categoryList.push(values[i].category);
  }
  const newCategoryList = categoryList.filter(
    (val, index) => categoryList.indexOf(val) === index
  );
  insertCategory(newCategoryList);
};

const insertCategory = (data) => {
  for (i = 0; i < data.length; i++) {
    const newOption = document.createElement("option");
    newOption.value = data[i];
    newOption.text = data[i];
    categorySelect.appendChild(newOption);
  }
};

let questionsList = [];
const difficultyList = ["easy", "medium", "hard"];

const fetchQuestionsByDifficulty = async (category) => {
  try {
    for (const difficulty of difficultyList) {
      const response = await fetch(
        `https://the-trivia-api.com/api/questions?categories=${category}&limit=2&difficulty=${difficulty}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const questions = await response.json();
        questionsList = questionsList.concat(questions);
      }
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

const gameSpace = document.getElementById("game");
const categorySelect = document.getElementById("Category");

const questionFetch = (event) => {
  if (event.target.className === "gameStart") {
    category.style.display = "none";
    gameSpace.style.display = "contents";

    selectedCategory = document.getElementById("Category").value;

    for (i = 0; i < categorySelect.options.length; i++) {
      if (categorySelect.options[i].value === selectedCategory) {
        categorySelect.remove(i);
        break;
      }
    }
    fetchQuestionsByDifficulty(selectedCategory).then(() => {
      displayQuestion();
    });
  }
};

const category = document.getElementById("category");
category.addEventListener("click", questionFetch);

let currentQuestionIndex = 0;
let currentPlayer = 1;

const displayQuestion = () => {
  gameSpace.innerHTML = "";

  let playerName = currentPlayer === 1 ? player1 : player2;

  if (currentQuestionIndex < questionsList.length) {
    const question = questionsList[currentQuestionIndex];
    const questionDiv = document.createElement("div");

    const turn = document.createElement("h4");
    turn.textContent = `${playerName}'s turn!`;
    questionDiv.appendChild(turn);

    const questionText = document.createElement("h4");
    questionText.textContent = question.question;
    questionDiv.appendChild(questionText);

    const options = question.incorrectAnswers.concat(question.correctAnswer);
    options.sort(() => Math.random() - 0.5);

    options.forEach((option) => {
      const answerLabel = document.createElement("label");
      const answerInput = document.createElement("input");
      answerInput.type = "radio";
      answerInput.name = "answer";
      answerInput.value = option;

      answerLabel.appendChild(answerInput);
      answerLabel.appendChild(document.createTextNode(option));
      questionDiv.appendChild(answerLabel);
      questionDiv.appendChild(document.createElement("br"));
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    questionDiv.appendChild(submitButton);

    const checkAnswer = document.createElement("p");
    questionDiv.appendChild(checkAnswer);

    submitButton.addEventListener("click", () =>
      handleAnswerSubmit(question, checkAnswer)
    );

    gameSpace.appendChild(questionDiv);
  } else {
    endButtons(gameSpace);
  }
};

const handleAnswerSubmit = (question, checkAnswer) => {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    if (selectedAnswer.value === question.correctAnswer) {
      checkAnswer.textContent = "Correct!";
      checkAnswer.style.color = "green";
      if (currentQuestionIndex === 0) {
        player1Score += 10;
      } else if (currentQuestionIndex === 1) {
        player2Score += 10;
      } else if (currentQuestionIndex === 2) {
        player1Score += 15;
      } else if (currentQuestionIndex === 3) {
        player2Score += 15;
      } else if (currentQuestionIndex === 4) {
        player1Score += 20;
      } else if (currentQuestionIndex === 5) {
        player2Score += 20;
      }
    } else {
      checkAnswer.textContent = `Wrong! The correct answer is ${question.correctAnswer}.`;
      checkAnswer.style.color = "red";
    }

    currentQuestionIndex++;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    setTimeout(displayQuestion, 1000);
  } else {
    checkAnswer.textContent = "Please select an answer.";
    checkAnswer.style.color = "red";
  }
};

const endButtons = (gameSpace) => {
  const playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Play Again";
  playAgainButton.addEventListener("click", playAgain);

  const endGameButton = document.createElement("button");
  endGameButton.textContent = "End Game";
  endGameButton.addEventListener("click", endGame);

  gameSpace.appendChild(playAgainButton);
  gameSpace.appendChild(endGameButton);
};

const endGame = () => {
  gameSpace.innerHTML = "";
  category.style.display = "none";
  scoreDisplay();
};

const playAgain = () => {
  if (categorySelect.options.length === 0) {
    gameSpace.innerHTML = "<h2>No more Categories left...!</h2>";
    category.style.display = "none";
    scoreDisplay();
  } else {
    resetGame();
    category.style.display = "block";
    gameSpace.innerHTML = "<h4>Loading...</h4>";
  }
};

const resetGame = () => {
  currentQuestionIndex = 0;
  currentPlayer = 1;
  questionsList = [];
};

const restart = () => {
  location.reload();
};
const scoreDisplay = () => {
  const gameOver = document.getElementById("end");
  gameOver.style.display = "block";
  const score1 = document.createElement("p");
  const score2 = document.createElement("p");
  const winner = document.createElement("h2");
  if (player1Score > player2Score) {
    winner.textContent = `${player1} Won the Match`;
  } else if (player2Score > player1Score) {
    winner.textContent = `${player2} Won the Match`;
  } else {
    winner.textContent = "MATCH DRAW";
  }
  score1.textContent = `${player1}'s Score: ${player1Score}`;
  score2.textContent = `${player2}'s Score: ${player2Score}`;
  gameOver.appendChild(winner);
  gameOver.appendChild(score1);
  gameOver.appendChild(score2);
  const playAgain = document.createElement("button");
  playAgain.textContent = "Play Again";
  gameOver.appendChild(playAgain);
  playAgain.addEventListener("click", restart);
};
