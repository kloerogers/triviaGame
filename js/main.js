// DOM Elements
const playerOneInput = document.querySelector('#pOneName');
const playerTwoInput = document.querySelector('#pTwoName');
const difficultySelector = document.querySelector('#difficultySelect');
const categorySelector = document.querySelector('#categorySelect');
const startGameButton = document.querySelector('#startGameBtn');

// Variables
const BASE_API_STRING = 'https://opentdb.com/api.php?amount=50';
const PLAYER_ONE_NAME = 'Player 1';
const PLAYER_TWO_NAME = 'Player 2';

// Functions
function textInputValidation(inputValue, playerDefaultValue) {
  if (inputValue) {
    return inputValue;
  } else {
    return playerDefaultValue;
  }
}
async function setGameData() {
  let playerOneNameValidated = textInputValidation(playerOneInput.value, PLAYER_ONE_NAME);
  let playerTwoNameValidated = textInputValidation(playerTwoInput.value, PLAYER_TWO_NAME);
  let categoryNameValidated = categorySelector.value === 'any' ? '' : `&category=${categorySelector.value}`;
  let difficultyNameValidated =
    difficultySelector.value === 'any' ? '' : `&difficulty=${difficultySelector.value}`;
  const fullAPIString = `${BASE_API_STRING}${categoryNameValidated}${difficultyNameValidated}`;

  let gameQuestions = await fetch(fullAPIString, { method: 'GET' }).then((response) =>
    response.json().then((responseAsJSON) => {
      let { results } = responseAsJSON;
      results.forEach((question) => {
        question.answer_array = shuffleAnswers([...question.incorrect_answers, question.correct_answer]);
      });
      return results;
    })
  );

  let baseGameData = {
    playerOne: {
      name: playerOneNameValidated,
      points: 0
    },
    playerTwo: {
      name: playerTwoNameValidated,
      points: 0
    },
    questions: gameQuestions,
    playerTurn: 0,
    turnsElapsed: 10
  };
  // Save the starting game data
  localStorage.setItem('gameData', JSON.stringify(baseGameData));

  if (localStorage.getItem('gameData')) {
    showQuestion();
  }
}
function showQuestion() {
  document.querySelector('#gameSetup').remove();
  let { playerOne, playerTwo, questions, playerTurn, turnsElapsed } = JSON.parse(localStorage.gameData);

  console.log(createAnswerHTML(questions, turnsElapsed));

  while (playerOne.points !== 10 || playerTwo.points !== 10) {
    break;
  }
}

function createAnswerHTML(questions, turn) {
  htmlString = `
    <section id="questionSection">
      <div>
        <h1>Question ${turn + 1}</h1>
        <progress max="10" value="10"></progress>
      </div>
      <h2>${questions[turn].question}</h2>
  `;
  questions[turn].answer_array.forEach((answer, i) => {
    htmlString += `
      <div>
        <input type="radio" name="answerSelect" id="answer${i}" />
          <label for="answer${i}">${answer}</label>
      </div>
    `;
  });
  htmlString += '</section>';
  return htmlString;
}

// Event listener
startGameButton.addEventListener('click', setGameData);
