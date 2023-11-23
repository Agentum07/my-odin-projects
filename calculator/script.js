//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// ENUMS //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
const DEFAULT_RESULT = '';
const ERROR = 'ERROR';

const DisplayTasks = {
  APPEND: 'append',
  BACKSPACE: 'backspace',
  RESET: 'reset',
  CLEAR: 'clear',
  OVERWRITE: 'overwrite',
  UPDATE: 'update',
  UPDATE_OPERATOR: 'updateOperator'
};

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
  return operator !== DEFAULT_RESULT;
}

function isCurrentResultDefined() {
  return currentResult !== DEFAULT_RESULT;
}

function isPreviousResultDefined() {
  return prevResult !== DEFAULT_RESULT;
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
  updateCurrentScreen(DisplayTasks.APPEND, numberPressed);
  updateCurrentResult();
}

function handleOperatorButtonClick(operationToPerform) {
  // divide into unary and binary operator.
  console.log(`handleOperatorButtonClick: current result: ${getCurrentResult()}, prevResult: ${getPreviousResult()}, currentOp: ${operationToPerform.textContent}, previousOp: ${operator}`);
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
  updateCurrentScreen(DisplayTasks.OVERWRITE, newResult);
}

function handleBinaryOperatorClick(operationToPerform='') {
  if (isOperatorDefined()) {
    console.log(`Operator is defined.`)
    // if an operator button is pressed twice
    if (!isCurrentResultDefined()) {
      updateHistoryScreen(DisplayTasks.UPDATE_OPERATOR, operationToPerform);
      setOperator(operationToPerform);
    } else {
      // first time || equal button pressed
      let operand1 = getPreviousResult();
      let operand2 = getCurrentResult();
      let newResult = performBinaryOperation(operand1, operand2, getOperator());
      if (newResult === ERROR) {
        return;
      }
      setPreviousResult(newResult);
      clearOperator();
      clearCurrentResult();
      console.log(`After handleOperation call. current: ${getCurrentResult()} previous: ${getPreviousResult()} op: ${getOperator()}`);

      if (operationToPerform === DEFAULT_RESULT) {
        setCurrentResult(newResult);
      } else {
        setOperator(operationToPerform);
        updateHistoryScreen(DisplayTasks.UPDATE, operationToPerform);
        updateCurrentScreen(DisplayTasks.OVERWRITE, prevResult);
      }
    }
  } else {
      console.log(`Operator is not defined.`)
      setOperator(operationToPerform);
      setPreviousResult(currentResult);
      clearCurrentResult();
      updateHistoryScreen(DisplayTasks.UPDATE, operationToPerform);
  }
}

function handleClearButtonClick() {
  updateCurrentScreen(DisplayTasks.RESET);
  updateHistoryScreen(DisplayTasks.RESET);
  clearCurrentResult();
  clearPreviousResult();
  clearOperator();
}

function handleBackspaceButtonClick() {
  updateCurrentScreen(DisplayTasks.BACKSPACE);
  updateCurrentResult();
}

function handleEqualButtonClick() {
  // only modify the display if there is a calculation left to conduct.
  if (isOperatorDefined()) {
    console.log(`handleEqualButtonClick. prev ${getPreviousResult()}, current ${getCurrentResult()}, op ${getOperator()}`);
    handleBinaryOperatorClick();
    if (getPreviousResult() !== '') {
      updateHistoryScreen(DisplayTasks.UPDATE, " = ");
      updateCurrentScreen(DisplayTasks.OVERWRITE, prevResult);
    }
  }
}

function updateCurrentScreen(task, updateValue='') {
  if (task === DisplayTasks.RESET) {
    // console.log("updateCurrentScreen: Reset current screen.")
    currentScreenVal = '0';
  } else if (task === DisplayTasks.CLEAR) {
    // console.log("updateCurrentScreen: Clear current screen.")
    currentScreenVal = '';
  } else if (task === DisplayTasks.OVERWRITE) {
    // console.log("updateCurrentScreen: Overwrite current screen.")
    currentScreenVal = updateValue;
  } else {
    currentScreenVal = currentScreen.textContent;
    if (task === DisplayTasks.BACKSPACE) {
      // console.log("updateCurrentScreen: Remove last element from current screen.")
      currentScreenVal = currentScreenVal.slice(0, -1);
      if (currentScreenVal === '') {
        currentScreenVal = '0';
      }
    } else if (task === DisplayTasks.APPEND) {
      // console.log(`updateCurrentScreen: Append ${updateValue} to current screen.`)
        if (currentScreenVal === '0' || !isCurrentResultDefined()) {
          currentScreenVal = '';
        }
        currentScreenVal += updateValue;
    }
  }
  currentScreen.textContent = currentScreenVal;
}

function updateHistoryScreen(task, updateValue) {
  if (task === DisplayTasks.RESET) {
    // console.log("updateHistoryScreen: Reset history screen.")
    historyScreenVal = '';
  } else if (task === DisplayTasks.UPDATE) {
    // console.log("updateHistoryScreen: Updated history screen.")
    if (!isPreviousResultDefined()) {
      historyScreenVal = updateValue;
    } else {
      historyScreenVal = historyScreen.textContent + ' ' + currentScreen.textContent + ' ' + updateValue;
    }
    updateCurrentScreen(DisplayTasks.CLEAR);
  } else if (task === DisplayTasks.OVERWRITE) {
    // console.log("updateHistoryScreen: Overwrite history screen.")
    historyScreenVal = updateValue;
  } else if (task === DisplayTasks.UPDATE_OPERATOR) {
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
    return ERROR;
  }
  return roundAnswer(num1 / num2);
}

function handleModulus(num1, num2) {
  return roundAnswer(num1 % num2);
}

///////////////////////////////////// ERRORS /////////////////////////////////////

function throwInvalidOperationError() {
  console.log("Invalid operation encountered.")
  updateHistoryScreen(DisplayTasks.RESET);
  updateCurrentScreen(DisplayTasks.RESET);
  updateCurrentScreen(DisplayTasks.OVERWRITE, "Invalid Operation");
  clearCurrentResult();
  clearPreviousResult();
}
