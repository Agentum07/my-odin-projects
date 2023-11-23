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
  clearCurrentResult();
  clearPreviousResult();
  clearOperator();
}

function setPreviousResult(newResult) {
  prevResult = newResult;
}

function setCurrentResult(newResult) {
  currentResult = newResult;
}

function updateCurrentResult() {
  currentResult = Number(currentScreen.textContent);
}

function clearPreviousResult() {
  prevResult = '';
}

function clearCurrentResult() {
  currentResult = '';
}

function clearOperator() {
  operator = '';
}

function handleBackspaceButtonClick() {
  updateCurrentScreen('backspace');
  updateCurrentResult();
}

function handleEqualButtonClick() {
  // only modify the display if there is a calculation left to conduct.
  if (operator !== '') {
    console.log(`handleEqualButtonClick. prev ${prevResult}, current ${currentResult}, op ${operator}`);
    // updateHistoryScreen('update', '');
    handleBinaryOperatorClick();
    updateHistoryScreen('update', " = ");
    updateCurrentScreen('overwrite', prevResult);
  }
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
    handleOperatorButtonClick(button);
  }
}

function handleNumberButtonClick(number) {
  // console.log(`handleNumberButtonClick: Number pressed: ${number.textContent}`);
  let numberPressed = number.textContent;
  updateCurrentScreen('append', numberPressed);
  updateCurrentResult();
}

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

function handleBinaryOperation(num1, num2, operationToPerform) {
  num2 = Number(num2);
  console.log(`handleOperation: ${prevResult} ${operator} ${num2}`);
  let newResult = calculateNewResult(num1, num2, operationToPerform);
  // console.log(`handleOperation: prev result: ${prevResult} Current result: ${currentResult}`)
  return newResult;
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

function handleBinaryOperatorClick(operationToPerform='') {
/*
if operator has been defined before:
  if current click is an operator:
    update screen
  else:
  shares with equal button click.
    perform binary operation(prevResult, currentResult, operator);
    update operator to operationToPerform;
else:
  define operator.
  prevResult = currResult
  reset current result.
  update history screen.
*/

  console.log(`handleBinaryOperation: current result: ${currentResult}, prevResult: ${prevResult}, op: ${operationToPerform.textContent}`);
  if (operator !== '') {
    // if an operator button is pressed twice
    if (currentResult === '') {
      updateHistoryScreen('updateOperator', operationToPerform);
      operator = operationToPerform;
    } else {
      // first time || or equal button pressed
      let newResult = handleBinaryOperation(prevResult, currentResult, operator);
      setPreviousResult(newResult);
      clearOperator();
      clearCurrentResult();
      console.log(`After handleOperation call. current: ${currentResult} previous: ${prevResult} op: ${operator}`);

      if (operationToPerform === '') {
        setCurrentResult(newResult);
      } else {
        operator = operationToPerform;
        updateHistoryScreen('update', operationToPerform);
        updateCurrentScreen('overwrite', prevResult);
      }
    }
  } else {
      console.log(`Operator is not defined.`)
      operator = operationToPerform;
      setPreviousResult(currentResult);
      clearCurrentResult();
      updateHistoryScreen('update', operationToPerform);
  }
}

function handleOperatorButtonClick(operationToPerform) {
  // divide into unary and binary operator.
  console.log(`handleOperatorButtonClick: current result: ${currentResult}, prevResult: ${prevResult}, op: ${operationToPerform.textContent}`);
  if (operationToPerform.classList.contains('unary')) {
    handleUnaryOperatorClick();
  } else {
    handleBinaryOperatorClick(operationToPerform.textContent);
    // update screen.
  }
}

function handleUnaryOperatorClick() {
  // TODO: Create getter for currentResult.
  operand = currentResult;
  let newResult = performUnaryOperation(operand);
  setCurrentResult(newResult);
  updateCurrentScreen('overwrite', newResult);
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

function performUnaryOperation(operand) {
  console.log(`handleUnaryOperation: Multiplying ${operand} by -1.`)
  operand *= -1;
  return operand;
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// ERRORS /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function throwInvalidOperationError() {
  console.log("Invalid operation encountered.")
  updateHistoryScreen('reset');
  updateCurrentScreen('reset');
  updateCurrentScreen('overwrite', "Invalid Operation");
  clearCurrentResult();
}
