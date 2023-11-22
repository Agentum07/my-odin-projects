let currentScreenVal = ''
let historyScreenVal = ''
let operator = ''
let currentResult = '';

const historyScreen = document.querySelector("#history");
const currentScreen = document.querySelector("#input");

const clear_btn = document.getElementsByClassName('clear-btn')[0];
const backspace_btn = document.getElementsByClassName('backspace-btn')[0];

clear_btn.addEventListener("click", () => handleClearButtonClick());
backspace_btn.addEventListener("click", () => handleBackspaceButtonClick());

function handleClearButtonClick() {
  updateCurrentScreen('reset');
  clearHistoryScreen();
}

function handleBackspaceButtonClick() {
  updateCurrentScreen('backspace');
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("Content loaded.");
  
  let numbers = document.querySelectorAll(".number");
  let operators = document.querySelectorAll(".operator");

  numbers.forEach((number) => number.addEventListener("click", () => handleNumberButtonClick(number)));
  operators.forEach((operator) => operator.addEventListener("click", () => handleOperatorButtonClick(operator)));
})

function handleNumberButtonClick(number) {
  currentScreenVal = number.textContent;
  updateCurrentScreen('append', currentScreenVal);
}

function updateCurrentScreen(task, updateValue='') {
  // task => append, backspace, clear
  // TODO: Break into smaller functions.
  if (task === 'reset') {
    currentScreenVal = '0';
  } else if (task === 'clear') {
    currentScreenVal = '';
  } else {
    currentScreenVal = currentScreen.textContent;
    if (task === 'backspace') {
      currentScreenVal = currentScreenVal.slice(0, -1);
      if (currentScreenVal === '') {
        currentScreenVal = '0';
      }
    } else if (task === 'append') {
        if (currentScreenVal === '0') {
          currentScreenVal = '';
        }
        currentScreenVal += updateValue;
    }
  }
  currentScreen.textContent = currentScreenVal;
}

function updateHistoryScreen(operator) {
  historyScreenVal = ' ' + currentScreen.textContent + ' ' + operator;
  historyScreen.textContent += historyScreenVal;
  updateCurrentScreen('clear');
}

function handleOperatorButtonClick(operator) {
  operator = operator.textContent;
  updateHistoryScreen(operator);
}

function clearHistoryScreen() {
  historyScreen.textContent = '';
}
