let currentScreenVal = ''
let historyScreenVal = ''
let operator = ''
let currentResult = '';
let prevResult = '';

const historyScreen = document.querySelector("#history");
const currentScreen = document.querySelector("#input");

const clear_btn = document.getElementById('clear-btn');
const backspace_btn = document.getElementById('backspace-btn');
const equal_btn = document.getElementById('equal-btn');

clear_btn.addEventListener("click", () => handleClearButtonClick());
backspace_btn.addEventListener("click", () => handleBackspaceButtonClick());
equal_btn.addEventListener("click", () => handleEqualButtonClick());

function handleClearButtonClick() {
  updateCurrentScreen('reset');
  updateHistoryScreen('reset');
}

function handleBackspaceButtonClick() {
  updateCurrentScreen('backspace');
}

function handleEqualButtonClick() {
  // figure out how to make history screen and current screen have the current result value.
  if (operator !== '') {
    console.log(`handleEqualButtonClick. prev ${prevResult}, current ${currentResult}, op ${operator}`);
    updateHistoryScreen('update', '');
    handleOperation(currentResult);
  }
  console.log(`handleEqualButtonClick: Final answer: ${prevResult}`);
  updateHistoryScreen('update', " = ");
  updateCurrentScreen('overwrite', prevResult);
  currentResult = prevResult;
  prevResult = '';
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("Content loaded.");
  
  let buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => button.addEventListener("click", () => handleButtonClick(button)));
})

function handleButtonClick(button) {
  if (button.classList.contains('number')) {
    handleNumberButtonClick(button);
  } else if (button.classList.contains('operator')) {
    if (!prevResult) {
      prevResult = currentResult;
      currentResult = '';
    }
    handleOperatorButtonClick(button);
  }
  // console.log(`handleButtonClick: current: ${currentResult}, prev: ${prevResult}`);
}

function handleNumberButtonClick(number) {
  // console.log(`handleNumberButtonClick: Number pressed: ${number.textContent}`);
  let numberPressed = number.textContent;
  updateCurrentScreen('append', numberPressed);
  currentResult = Number(currentScreen.textContent);
}

// handle binary operation
function handleOperation(num2) {
  num2 = Number(num2);
  console.log(`handleOperation: ${prevResult} ${operator} ${num2}`);
  switch (operator) {
    case '+':
      currentResult = handleAddition(prevResult, num2);
      break;
    case '-':
      currentResult = handleSubstraction(prevResult, num2);
      break;
    case 'x':
      currentResult = handleMultiplication(prevResult, num2);
      break;
    case '/':
      currentResult = handleDivision(prevResult, num2);
      break;
    case '%':
      currentResult = handleModulus(prevResult, num2);
      break;
  }
  operator = '';
  prevResult = currentResult;
  currentResult = '';
  console.log(`handleOperation: prev result: ${prevResult} Current result: ${currentResult}`)
}

function updateCurrentScreen(task, updateValue='') {
  // task => append, backspace, clear, clear, overwrite
  // TODO: Break into smaller functions.
  // TODO: create enum for all the strings. Align strings between current and history screens.
  if (task === 'reset') {
    // console.log("updateCurrentScreen: Reset current screen.")
    currentScreenVal = '0';
    currentResult = '';
    prevResult = '';
  } else if (task === 'clear') {
    // console.log("updateCurrentScreen: Clear current screen.")
    currentScreenVal = '';
  } else if (task === 'overwrite') {
    // console.log("updateCurrentScreen: Overwrite current screen.")
    currentScreenVal = updateValue;
  } else {
    currentScreenVal = currentScreen.textContent;
    if (task === 'backspace') {
      // console.log("updateCurrentScreen: Remove last element from current screen.")
      currentScreenVal = currentScreenVal.slice(0, -1);
      if (currentScreenVal === '') {
        currentScreenVal = '0';
      }
    } else if (task === 'append') {
      // console.log(`updateCurrentScreen: Append ${updateValue} to current screen.`)
        if (currentScreenVal === '0' || currentResult === '') {
          currentScreenVal = '';
        }
        currentScreenVal += updateValue;
    }
  }
  currentScreen.textContent = currentScreenVal;
}

function updateHistoryScreen(task, updateValue) {
  // reset, update, overwrite
  // TODO: Break into smaller functions.
  // TODO: create enum for all the strings. Align strings between current and history screens.
  if (task === 'reset') {
    // console.log("updateHistoryScreen: Reset history screen.")
    historyScreenVal = '';
  } else if (task === 'update') {
    // console.log("updateHistoryScreen: Updated history screen.")
    if (prevResult === '') {
      historyScreenVal = updateValue;
    } else {
      historyScreenVal = historyScreen.textContent + ' ' + currentScreen.textContent + ' ' + updateValue;
    }
    updateCurrentScreen('clear');
  } else if (task === 'overwrite') {
    // console.log("updateHistoryScreen: Overwrite history screen.")
    historyScreenVal = updateValue;
  } else if (task === 'updateOperator') {
    historyScreenVal = historyScreen.textContent.slice(0, -1) + updateValue;
    // console.log(`Update history screen. ${historyScreenVal}`);
  }
  historyScreen.textContent = historyScreenVal;
}

function handleOperatorButtonClick(operationToPerform) {
  console.log(`handleOperatorButtonClick: current result: ${currentResult}, prevResult: ${prevResult}, op: ${operator}`);

  // if operator has been defined before
  if (operator !== '') {
    console.log(`Operator is defined.`)
    // if an operator button is pressed twice
    if (currentResult === '') {
      updateHistoryScreen('updateOperator', operationToPerform.textContent);
    } else {
      // first time 
      handleOperation(currentResult);
      operator = '';
      updateHistoryScreen('update', operationToPerform.textContent);
      updateCurrentScreen('overwrite', prevResult);
    }
    operator = operationToPerform.textContent;
  } else {
    console.log(`Operator is not defined.`)
    // handle unary operator
    if (operationToPerform.classList.contains('unary')) {
      handleUnaryOperation();
    } else {
      operator = operationToPerform.textContent;
      updateHistoryScreen('update', operationToPerform.textContent);
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// MATH FUNCTIONS /////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function roundAnswer(numToRound) {
  console.log(`roundAnswer: Rounding ${numToRound}`);
  if (numToRound.toString().indexOf('.') !== -1) {
    if (numToRound.toString().split('.')[1].length > 5) {
      return numToRound.toFixed(5);
    }
  }
  return numToRound;
}

function handleAddition(num1, num2) {
  return roundAnswer(num1 + num2);
}

function handleSubstraction(num1, num2) {
  return roundAnswer(num1 - num2);
}

function handleMultiplication(num1, num2) {
  console.log(`handleMultiplication: Multiplying ${num1} with ${num2}`);
  return roundAnswer(num1 * num2);
}

function handleDivision(num1, num2) {
  if (num2 === 0) {
    throwInvalidOperationError();
    return;
  }
  return roundAnswer(num1 / num2);
}

function handleModulus(num1, num2) {
  return roundAnswer(num1 % num2);
}

function handleUnaryOperation() {
  console.log(`handleUnaryOperation: Multiplying ${prevResult} by -1.`)
  prevResult = prevResult * -1;
  currentResult = prevResult;
  updateCurrentScreen('overwrite', currentResult);
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// ERRORS /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function throwInvalidOperationError() {
  console.log("Invalid operation encountered.")
  updateHistoryScreen('reset');
  updateCurrentScreen('reset');
  updateCurrentScreen('overwrite', "Invalid Operation");
  currentResult = '';
}
