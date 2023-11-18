// Backend
function validateInput(input) {
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

function createGird(gridSize=DEFAULT_SIZE) {
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  let numDivs = gridSize * gridSize;
  for (let i = 0; i < numDivs; i++) {
    let div = document.createElement("div");
    div.style.backgroundColor = DEFAULT_DIV_COLOR;
    div.style.border = "1px solid black";
    div.style.padding = "0.25px";
    div.addEventListener("mouseover", colorDiv);
    div.addEventListener("mousedown", colorDiv);
    div.addEventListener("mouseleave", highlightDiv);
    board.insertAdjacentElement("beforeend", div);
  }
  console.log(`Divs created: ${board.childElementCount}`)
  highlightButtonByDefault();
}

function deleteGrid() {
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
  input_dialog.value = DEFAULT_SIZE;
  // Change default divColor to black
  divColor = DEFAULT_STROKE_COLOR;
  console.log("Grid reset to default.")
}

function clearGrid() {
  board.childNodes.forEach(div => {
    div.style.backgroundColor = DEFAULT_DIV_COLOR;
  });
  console.log("Cleared grid.");
}

// UI
let divColor = "black";
let isBorderEnabled = true;

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

const board = document.querySelector(".board");
const input_dialog = document.querySelector("input");
const message = document.querySelector("#message")

const all_buttons = document.getElementsByClassName("button");
const black_btn = document.getElementById("black-button");
const random_btn = document.getElementById("random-button");
const erase_btn = document.getElementById("erase-button");

black_btn.addEventListener("click", () =>  blackButtonClickEvent());
random_btn.addEventListener("click", () => randomButtonClickEvent());
erase_btn.addEventListener("click", () =>  eraseButtonClickEvent());

const DEFAULT_STROKE_COLOR = "black";
const DEFAULT_DIV_COLOR = "white";
const DEFAULT_SIZE = 16;
const DEFAULT_BORDER = "1px solid black";

function highlightButtonByDefault() {
  highlightButton(black_btn);
}

function resetButtons() {
  console.log("Reset all buttons to default.");
  [...all_buttons].forEach(div => {
    div.style.backgroundColor = "lightblue";
    div.style.color = "black";
  });
}

function highlightButton(button) {
  button.style.backgroundColor = "darkblue";
  button.style.color = "white";
}

function blackButtonClickEvent() {
  resetButtons();
  divColor = "black";
  highlightButton(black_btn);
  console.log(`Stroke color changed to black.`)
}

function randomButtonClickEvent() {
  resetButtons();
  divColor = "random";
  highlightButton(random_btn);
  console.log(`Stroke color changed to random.`)
  return;
}

function eraseButtonClickEvent() {
  resetButtons();
  eraseColor();
  highlightButton(erase_btn);
  console.log(`Stroke color changed to erase.`)
}

function highlightDiv(event) {
  if (event.target.style.backgroundColor === DEFAULT_DIV_COLOR) {
    if (event.type == 'mouseover') {
      event.target.style.backgroundColor = "darkgray";
    }
  }
  if (event.target.style.backgroundColor === "darkgray") {
    if (event.type == 'mouseleave') {
      event.target.style.backgroundColor === DEFAULT_DIV_COLOR;
    }
  }
}

function colorDiv(event) {
  if (event.type === 'mouseover' && !mouseDown) {
    // highlight div
    // highlightDiv(event);
    return;
  }
  if (divColor === "random") {
    event.target.style.backgroundColor = getRandomColor();
  } else {
    event.target.style.backgroundColor = divColor;
  }
}

function toggleGrid() {
  console.log(`${isBorderEnabled}`)
  if (isBorderEnabled) {
    board.childNodes.forEach(div => {
      div.style.border = "none";
    });
  } else {
    board.childNodes.forEach(div => {
      div.style.border = DEFAULT_BORDER;
    });
  }
  isBorderEnabled = !isBorderEnabled;
}

function eraseColor() {
  setColor(DEFAULT_DIV_COLOR)
}

function setColor(colorChoice) {
    divColor = colorChoice;
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("Content loaded.")
  createGird();
})
