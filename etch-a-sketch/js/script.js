let divColor = "black";
document.addEventListener("DOMContentLoaded", function() {
  console.log("Content loaded.")
  createGird();
})

function validateInput(input) {
  let message = document.querySelector("#message")
  if (input === "") {
    message.innerHTML = "Please provide a number.";
    return false;
  } else if (input < 1 || input > 100) {
    message.innerHTML = "Please provide a number between 1 and 100.";
    return false;
  } else {
    message.innerHTML = "Go ahead!"
    return true;
  }
}

function createGird(gridSize=16) {
  const board = document.querySelector(".board");

  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  let numDivs = gridSize * gridSize;
  for (let i = 0; i < numDivs; i++) {
    let div = document.createElement("div");
    div.style.backgroundColor = "gray";
    div.style.border = "1px solid black";
    div.style.margin = "0.25px";
    div.addEventListener("mouseover", () => colorDiv(div));
    board.insertAdjacentElement("beforeend", div);
  }
  console.log(`Divs created: ${board.childElementCount}`)
}

function deleteGrid() {
  const board = document.querySelector(".board");
  let numDivs = board.childElementCount;
  if (board.childElementCount !== 0) {
    board.replaceChildren();
    console.log(`Deleted ${numDivs} divs.`);
  } else {
    console.log("Delete function called on an empty grid.")
  }
}

function changeGridSize(newSize) {
  if (validateInput(newSize)) {
    deleteGrid();
    createGird(newSize);
  }
}

function resetGrid() {
  // Reset grid to default size.
  deleteGrid();
  createGird();
  // Change input dialog box text to default value.
  const input = document.querySelector("input");
  input.value = 16;
  // Change default divColor to black
  divColor = "black";
  console.log("Grid reset to default.")
}

function colorDiv(div) {
  if (divColor === "black") {
    div.style.backgroundColor = divColor;
  } else {
    div.style.backgroundColor = getRandomColor();
  }
}

function setColor(colorChoice) {
    divColor = colorChoice;
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}
