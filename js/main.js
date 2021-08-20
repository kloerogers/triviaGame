window.addEventListener('load', (e) => {
  this.game = Game.getInstance();
});

//  Ensures only one instance of the game exists
class Game {
  constructor() {
    this.controller = new Controller();
  }
  static getInstance(_instance) {
    if (!Game._instance) {
      Game._instance = new Game();
      console.log(Game._instance);
    } else {
      throw "Can't create a new game!";
    }
  }
}

class Controller {
  constructor() {
    this.playerTurn = 0;
    this.model = new Model();

    document.querySelector('#startGameBtn').addEventListener('click', this.formSubmit.bind(this));
  }

  // Setting up all the information for the game
  formSubmit(e) {
    e.preventDefault();
    let errorArray = [];
    const pOneNameValue = document.querySelector('#pOneName').value
      ? document.querySelector('#pOneName').value
      : errorArray.push('pOne');
    const pTwoNameValue = document.querySelector('#pTwoName').value
      ? document.querySelector('#pTwoName').value
      : errorArray.push('pTwo');
    const selectedCategory =
      document.querySelector('#categorySelect').value === 'any'
        ? ''
        : document.querySelector('#categorySelect').value;
    const selectedDifficulty =
      document.querySelector('#difficultySelect').value === 'any'
        ? ''
        : document.querySelector('#difficultySelect').value;

    if (errorArray.length === 0) {
      this.gameData = {
        playerOne: pOneNameValue,
        playerTwo: pTwoNameValue,
        category: selectedCategory,
        difficulty: selectedDifficulty
      };
      this.model.apiCall({ selectedCategory, selectedDifficulty });

      let event = new Event('formSubmitted');
      event.info = {
        data: this.gameData,
        turn: this.playerTurn
      };
      document.dispatchEvent(event);
    }
  }
}

// Used for any data processing
class Model {
  constructor() {}
  apiCall(data) {
    const { selectedCategory, selectedDifficulty } = data;
    const category = selectedCategory ? `&category=${selectedCategory}` : '';
    const difficulty = selectedDifficulty ? `&difficulty=${selectedDifficulty}` : '';
    const apiString = `https://opentdb.com/api.php?amount=50${category}${difficulty}`;

    console.log(apiString);
  }
}
