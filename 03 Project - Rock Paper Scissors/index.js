const buttons = document.querySelectorAll(".choice-btn");
const playerChoiceShow = document.getElementById("player");
const computerChoiceShow = document.getElementById("computer");
const winner = document.getElementById("round-winner");
const playerTotalScore = document.querySelector(".player-total-score");
const computerTotalScore = document.querySelector(".computer-total-score");
const gameWinner = document.querySelector(".game-winner");
const choicesContainer = document.querySelector(".choices");
const countdownDisplay = document.querySelector(".countdown");

// Generate random choice for Computer
function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  let choiceIndex = Math.floor(Math.random() * choices.length);
  return choices[choiceIndex];
}

let playerScore = 0;
let computerScore = 0;

// Get the result of every round
function getResult(playerChoice, computerChoice) {
  //   console.log(playerChoice, computerChoice);
  if (playerChoice === computerChoice) {
    winner.textContent = "It's a Tie!";
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    winner.textContent = "Player Wins!";
    playerScore += 1;
  } else {
    winner.textContent = "Computer Wins!";
    computerScore += 1;
  }
  playerTotalScore.textContent = playerScore;
  computerTotalScore.textContent = computerScore;

  getWinner(playerScore, computerScore);
  //   console.log(playerScore, computerScore);
}

// Calculate the overall score and determine the whole game round winner
function getWinner(playerScore, computerScore) {
  if (playerScore == 5 || computerScore == 5) {
    if (playerScore == 5) {
      winner.textContent = "Player Won the Game!";
      //   console.log("Player Won the Game!");
    } else {
      winner.textContent = "Computer Won the Game!";
      //   console.log("Computer Won the Game!");
    }

    choicesContainer.style.display = "none";

    // Resetting the Game
    let countdown = 3;
    countdownDisplay.textContent = `Resetting in ${countdown}...`;
    countdownDisplay.style.display = "block";

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownDisplay.textContent = `Resetting in ${countdown}...`;
      } else {
        clearInterval(countdownInterval);
        countdownDisplay.textContent = ``;
      }
    }, 1000);

    // Wait for 3 seconds before resetting the game
    setTimeout(() => {
      resetGame();
      choicesContainer.style.display = "block";
    }, 3000);
  }
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;

  playerTotalScore.textContent = playerScore;
  computerTotalScore.textContent = computerScore;

  buttons.forEach((btn) => btn.classList.remove("choice-btn-active"));

  winner.textContent = "Choose One!";
}

// Player chooses every game round by clicking the buttons
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const value = button.getAttribute("data-value");
    buttons.forEach((btn) => btn.classList.remove("choice-btn-active"));
    button.classList.add("choice-btn-active");
    playerChoiceShow.src = `./assets/left-${value}.svg`;
    let playerChoice = value;
    let computerChoice = getComputerChoice();
    // console.log("Player: " + playerChoice);
    // console.log("Computer: " + computerChoice);
    computerChoiceShow.src = `./assets/right-${computerChoice}.svg`;

    getResult(playerChoice, computerChoice);
  });
});
