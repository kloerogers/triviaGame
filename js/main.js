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

let forErrorArray = [];
let baseGameData = {};
let gameQuestions = {};

// Functions
function textInputValidation(inputValue, playerDefaultValue) {
  if (inputValue) {
    return inputValue;
  } else {
    forErrorArray.push(playerDefaultValue);
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

  gameQuestions = await fetch(fullAPIString, { method: 'GET' }).then((response) =>
    response.json().then((responseAsJSON) => {
      let { results } = responseAsJSON;
      results.forEach((question) => {
        question.answer_array = shuffleAnswers([...question.incorrect_answers, question.correct_answer]);
      });
      return results;
    })
  );

  baseGameData = {
    playerOne: playerOneNameValidated,
    playerTwo: playerTwoNameValidated,
    questions: gameQuestions
  };
}

// Event listener
startGameButton.addEventListener('click', setGameData);
