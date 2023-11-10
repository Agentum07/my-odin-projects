// Backend
let clickCounter = 0;
let playerScore = 0;
let computerScore = 0;
let roundWinner = '';


function getComputerChoice() {
  let choices = ['rock', 'paper', 'scissor'];
  let choice = choices[Math.floor(Math.random() * choices.length)];
  return choice
}

function handleClickEvent(playerChoice) {
  let computerChoice = getComputerChoice();
  playGame(playerChoice, computerChoice);
  if (isEndGame()) {
    if (playerScore > computerChoice) {
      endGameText.textContent = "You won! Reload the page to play again!"
    } else {``
      endGameText.textContent = "You lost. Reload the page to play again!"
    }
    rock_button.disabled = true;
    scissor_button.disabled = true;
    paper_button.disabled = true;
  }
  return;
}

function isEndGame() {
  return playerScore >= 5 || computerScore >= 5;
}

function playGame(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    roundWinner = 'tie';
  } else {
    if ((playerChoice === "rock" && computerChoice === "scissor") || 
        (playerChoice === "paper" && computerChoice === "rock") || 
        (playerChoice === "scissor" && computerChoice === "paper")) {
          roundWinner = 'player';
          updatePlayerScore();
    } else {
      roundWinner = 'computer';
      updateComputerScore();
    }
  }
  updateScoreMessages(roundWinner, playerChoice, computerChoice);
}

function updateComputerScore() {
  computerScore++;
}

function updatePlayerScore() {
  playerScore++; 
}

// UI
const rock_button = document.getElementById("rock");
const paper_button = document.getElementById("paper");
const scissor_button = document.getElementById("scissor");
const result = document.getElementById("result");
const scoreInfo = document.getElementById("scoreInfo");
const scoreMessage = document.getElementById("scoreMessage");
const playerSignText = document.getElementById("playerSign");
const computerSignText = document.getElementById("computerSign");
const playerScoreText = document.getElementById("playerScore");
const computerScoreText = document.getElementById("computerScore");
const endGameText = document.getElementById("endgame");

rock_button.addEventListener("click", () => handleClickEvent("rock"));
paper_button.addEventListener("click", () => handleClickEvent("paper"));
scissor_button.addEventListener("click", () => handleClickEvent("scissor"));

function updateScoreMessages(roundWinner, playerChoice, computerChoice) {
  updateSigns(playerChoice, computerChoice);
  updateScoreInfo(roundWinner);
  updateScoreMessage(roundWinner, playerChoice, computerChoice);
  playerScoreText.textContent = "Player: " + playerScore;
  computerScoreText.textContent = "Computer: " + computerScore;
  return;

}

function updateSigns(playerChoice, computerChoice) {
  switch (playerChoice) {
    case "rock":
      playerSignText.textContent = '✊'
      break
    case 'paper':
      playerSignText.textContent = '✋'
      break
    case 'scissor':
      playerSignText.textContent = '✌'
      break
  }

  switch (computerChoice) {
    case "rock":
      computerSignText.textContent = '✊'
      break
    case 'paper':
      computerSignText.textContent = '✋'
      break
    case 'scissor':
      computerSignText.textContent = '✌'
      break
  }
  
}

function updateScoreInfo(roundWinner) {
  if (roundWinner === 'tie') {
    scoreInfo.textContent = "It's a tie";
  } else if (roundWinner === 'player') { 
    scoreInfo.textContent = "You won!";
  } else {
    scoreInfo.textContent = "You lost.";
  }
}

function updateScoreMessage(roundWinner, playerChoice, computerChoice) {
  if (roundWinner === 'player') {
    scoreMessage.textContent = `${capitalizeFirstLetter(playerChoice)} beats ${computerChoice.toLowerCase()}`
  } else if (roundWinner === 'computer') {
    scoreMessage.textContent = `${capitalizeFirstLetter(playerChoice)} is beaten by ${computerChoice.toLowerCase()}`
  } else {
    scoreMessage.textContent = `${capitalizeFirstLetter(playerChoice)} ties with ${computerChoice.toLowerCase()}`
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}