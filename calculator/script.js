//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTROLLERS ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////// GETTER FUNCTIONS /////////////////////////////////

function getPreviousResult() {
  return prevResult;
}

function getCurrentResult() {
  return currentResult;
}

function getOperator() {
  return operator;
}

/////////////////////////////// SETTER FUNCTIONS /////////////////////////////////

function setPreviousResult(newResult) {
  prevResult = newResult;
}

function setCurrentResult(newResult) {
  currentResult = newResult;
}

function updateCurrentResult() {
  currentResult = Number(currentScreen.textContent);
}

function setOperator(newOperator) {
  operator = newOperator;
}

/////////////////////////////// RESET FUNCTIONS //////////////////////////////////

function clearPreviousResult() {
  prevResult = '';
}

function clearCurrentResult() {
  currentResult = '';
}

function clearOperator() {
  operator = '';
}

function isOperatorDefined() {
  return operator !== '';
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// FRONTEND ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function() {
  console.log("Content loaded.");
  
  let buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => button.addEventListener("click", () => handleButtonClick(button)));
})

function handleButtonClick(button) {
  if (button.classList.contains('number')) {
    handleNumberButtonClick(button);
  } else if (button.classList.contains('operator')) {
    handleOperatorButtonClick(button);
  }
}

function handleNumberButtonClick(number) {
  // console.log(`handleNumberButtonClick: Number pressed: ${number.textContent}`);
  let numberPressed = number.textContent;
  updateCurrentScreen('append', numberPressed);
  updateCurrentResult();
}

function handleOperatorButtonClick(operationToPerform) {
  // divide into unary and binary operator.
  console.log(`handleOperatorButtonClick: current result: ${getCurrentResult()}, prevResult: ${getPreviousResult()}, op: ${operationToPerform.textContent}`);
  if (operationToPerform.classList.contains('unary')) {
    handleUnaryOperatorClick();
  } else {
    handleBinaryOperatorClick(operationToPerform.textContent);
  }
}

function handleUnaryOperatorClick() {
  operand = getCurrentResult();
  let newResult = performUnaryOperation(operand);
  setCurrentResult(newResult);
  updateCurrentScreen('overwrite', newResult);
}

function handleBinaryOperatorClick(operationToPerform='') {
  if (isOperatorDefined()) {
    // if an operator button is pressed twice
    if (currentResult === '') {
      updateHistoryScreen('updateOperator', operationToPerform);
      setOperator(operationToPerform);
    } else {
      // first time || equal button pressed
      let operand1 = getPreviousResult();
      let operand2 = getCurrentResult();
      let newResult = performBinaryOperation(operand1, operand2, getOperator());
      if (newResult === 'ERROR') {
        return;
      }
      setPreviousResult(newResult);
      clearOperator();
      clearCurrentResult();
      console.log(`After handleOperation call. current: ${getCurrentResult()} previous: ${getPreviousResult()} op: ${getOperator()}`);

      if (operationToPerform === '') {
        setCurrentResult(newResult);
      } else {
        setOperator(operationToPerform);
        updateHistoryScreen('update', operationToPerform);
        updateCurrentScreen('overwrite', prevResult);
      }
    }
  } else {
      console.log(`Operator is not defined.`)
      setOperator(operationToPerform);
      setPreviousResult(currentResult);
      clearCurrentResult();
      updateHistoryScreen('update', operationToPerform);
  }
}

function handleClearButtonClick() {
  updateCurrentScreen('reset');
  updateHistoryScreen('reset');
  clearCurrentResult();
  clearPreviousResult();
  clearOperator();
}

function handleBackspaceButtonClick() {
  updateCurrentScreen('backspace');
  updateCurrentResult();
}

function handleEqualButtonClick() {
  // only modify the display if there is a calculation left to conduct.
  // TODO: Overwrite current result if a number is pressed after pressing =.
  if (isOperatorDefined()) {
    console.log(`handleEqualButtonClick. prev ${getPreviousResult()}, current ${getCurrentResult()}, op ${getOperator()}`);
    handleBinaryOperatorClick();
    if (getPreviousResult() !== '') {
      updateHistoryScreen('update', " = ");
      updateCurrentScreen('overwrite', prevResult);
    }
  }
}

function updateCurrentScreen(task, updateValue='') {
  // task => append, backspace, clear, clear, overwrite
  // TODO: Break into smaller functions.
  // TODO: create enum for all the strings. Align strings between current and history screens.
  if (task === 'reset') {
    // console.log("updateCurrentScreen: Reset current screen.")
    currentScreenVal = '0';
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
  // reset, update, overwrite, updateOperator
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

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// BACKEND ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function calculateNewResult(num1, num2, operationToPerform) {
  switch (operationToPerform) {
    case '+':
      return handleAddition(num1, num2);
    case '-':
      return handleSubstraction(num1, num2);
    case 'x':
      return handleMultiplication(num1, num2);
    case '/':
      return handleDivision(num1, num2);
    case '%':
      return handleModulus(num1, num2);
  }
}

function performUnaryOperation(operand) {
  console.log(`handleUnaryOperation: Multiplying ${operand} by -1.`)
  operand *= -1;
  return operand;
}

function performBinaryOperation(num1, num2, operationToPerform) {
  num2 = Number(num2);
  console.log(`handleBinaryOperation: ${getPreviousResult()} ${getOperator()} ${num2}`);
  let newResult = calculateNewResult(num1, num2, operationToPerform);
  return newResult;
}

///////////////////////////////// MATH FUNCTIONS /////////////////////////////////

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
    return 'ERROR';
  }
  return roundAnswer(num1 / num2);
}

function handleModulus(num1, num2) {
  return roundAnswer(num1 % num2);
}

///////////////////////////////////// ERRORS /////////////////////////////////////

function throwInvalidOperationError() {
  console.log("Invalid operation encountered.")
  updateHistoryScreen('reset');
  updateCurrentScreen('reset');
  updateCurrentScreen('overwrite', "Invalid Operation");
  clearCurrentResult();
  clearPreviousResult();
}
