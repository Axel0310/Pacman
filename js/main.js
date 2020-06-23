import { Player } from "./player.js";

const player = new Player();

function updateScore(nb) {
  player.increaseScore(nb);
  document.getElementById("score").textContent = String(player.score);
}

//Inky, Pinky, Blinky and Clyde

const pacmanElmt = document.getElementById("pacman");

//Constant used within move functions to define the velocity of pacman and ghosts
const gameVelocity = 500;

//Function returning an object with the grid position of an element
function getGridCoord(elmt) {
  return {
    rowStart: Number(window.getComputedStyle(elmt).gridRowStart),
    rowEnd:
      window.getComputedStyle(elmt).gridRowEnd === "auto"
        ? Number(window.getComputedStyle(elmt).gridRowStart) + 1
        : Number(window.getComputedStyle(elmt).gridRowEnd),
    columnStart: Number(window.getComputedStyle(elmt).gridColumnStart),
    columnEnd:
      window.getComputedStyle(elmt).gridColumnEnd === "auto"
        ? Number(window.getComputedStyle(elmt).gridColumnStart) + 1
        : Number(window.getComputedStyle(elmt).gridColumnEnd),
  };
}

//Pacman object declaration
const pacman = {
  elmt: () => document.getElementById("pacman"),
  mvtTimer: null,
  gridCoord: getGridCoord(pacmanElmt),
};

//Create div corresponding to light balls and display them on the grid
function displayLightBalls() {
  const gameWindow = document.getElementById("game-window");
  const initialGameElmtArr = Array.from(document.querySelectorAll(".border, #pacman, .ghost"));
  const gridCoordArr = initialGameElmtArr.map( elmt => getGridCoord(elmt));
  for (let x = 2; x < 19; x++) {
    for (let y = 2; y < 19; y++) {
      const cellIsOccupied = gridCoordArr.reduce( (acc, elmt) => {
        if(x < elmt.columnEnd &&
          x + 1 > elmt.columnStart &&
          y < elmt.rowEnd &&
          y + 1 > elmt.rowStart){
          return true;
        } else return acc;
      }, false)
      if(cellIsOccupied === false){
        gameWindow.innerHTML += `<div id="ball-${x}-${y}" class="element ball" style="grid-row: ${y}; grid-column: ${x}"></div>`;
      }
    }
  }
}

displayLightBalls();

//Check if there is still at least 1 ligth ball to catch
function checkIfWin(){
  const remainingLightBall = document.querySelectorAll(".ball");
  if(remainingLightBall.length === 0){
    return true;
  } else return false;
}

//
function eatLightBall(elmt){
  elmt.remove();
  updateScore(10);
  if(checkIfWin()){
    console.log("Winner !!!")
  }
}

//Array containing all the elements in the game window (pacman, ghosts, balls, borders)
let gameElmtArr = Array.from(document.querySelectorAll(".element"));

//Move a pawn (pacman or ghost) 1 cell up on the grid
function shiftTop(pawn) {
  pawn.gridCoord.rowStart--;
  pawn.gridCoord.rowEnd--;
  pawn.elmt().style.gridRowStart = String(pawn.gridCoord.rowStart);
  pawn.elmt().style.gridRowEnd = String(pawn.gridCoord.rowEnd);
}

//Move a pawn (pacman or ghost) 1 cell right on the grid
function shiftRight(pawn) {
  pawn.gridCoord.columnStart++;
  if(pawn.gridCoord.columnStart === 20) pawn.gridCoord.columnStart = 1;
  pawn.gridCoord.columnEnd = pawn.gridCoord.columnStart + 1;
  console.log(pawn.gridCoord.columnStart);
  pawn.elmt().style.gridColumnStart = String(pawn.gridCoord.columnStart);
  pawn.elmt().style.gridColumnEnd = String(pawn.gridCoord.columnEnd);
}

//Move a pawn (pacman or ghost) 1 cell down on the grid
function shiftDown(pawn) {
  pawn.gridCoord.rowStart++;
  pawn.gridCoord.rowEnd++;
  pawn.elmt().style.gridRowStart = String(pawn.gridCoord.rowStart);
  pawn.elmt().style.gridRowEnd = String(pawn.gridCoord.rowEnd);
}

//Move a pawn (pacman or ghost) 1 cell left on the grid
function shiftLeft(pawn) {
  pawn.gridCoord.columnStart--;
  if(pawn.gridCoord.columnStart === 0) pawn.gridCoord.columnStart = 19;
  pawn.gridCoord.columnEnd = pawn.gridCoord.columnStart + 1;
  pawn.elmt().style.gridColumnStart = String(pawn.gridCoord.columnStart);
  pawn.elmt().style.gridColumnEnd = String(pawn.gridCoord.columnEnd);
}

//Check if the next cell of the pawn has already an element. If yes return the element already there, if no return false
function detectCollision(pawnColStart, pawnRowStart) {
  //From the array of all elements in the grid, check if there is one in the next left cell
  const obstacleArr = gameElmtArr.filter((elmt) => {
    const elmtCoord = getGridCoord(elmt);
    if (
      pawnColStart < elmtCoord.columnEnd &&
      pawnColStart + 1 > elmtCoord.columnStart &&
      pawnRowStart < elmtCoord.rowEnd &&
      pawnRowStart + 1 > elmtCoord.rowStart
    ) {
      return true;
    } else return false;
  });
  if (obstacleArr.length === 0) return false;
  else return obstacleArr[0];
}

//Check what is the element in collision. If it is a border (blocking the movement), returns false, otherwise (ball or ghost) return true
function checkCollisionElmt(pawn, elmt) {
  if (elmt.classList.contains("border")) {
    return false;
  } else if (elmt.classList.contains("ball")) {
    eatLightBall(elmt)
    return true;
  }
}

//Move a pawn (pacman or ghost) up on the grid until an obstacle is met
function moveTop(pawn) {
  pawn.mvtTimer = setInterval(() => {
    const collision = detectCollision(
      pawn.gridCoord.columnStart,
      pawn.gridCoord.rowStart - 1
    );
    if (collision === false) {
      shiftTop(pawn);
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        shiftTop(pawn);
      } else {
        clearInterval(pawn.mvtTimer);
      }
    }
  }, gameVelocity);
}

//Move a pawn (pacman or ghost) right on the grid until an obstacle is met
function moveRight(pawn) {
  pawn.mvtTimer = setInterval(() => {
    const collision = detectCollision(
      pawn.gridCoord.columnStart + 1,
      pawn.gridCoord.rowStart
    );
    if (collision === false) {
      shiftRight(pawn);
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        shiftRight(pawn);
      } else {
        clearInterval(pawn.mvtTimer);
      }
    }
  }, gameVelocity);
}

//Move a pawn (pacman or ghost) down on the grid until an obstacle is met
function moveDown(pawn) {
  pawn.mvtTimer = setInterval(() => {
    const collision = detectCollision(
      pawn.gridCoord.columnStart,
      pawn.gridCoord.rowStart + 1
    );
    if (collision === false) {
      shiftDown(pawn);
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        shiftDown(pawn);
      } else {
        clearInterval(pawn.mvtTimer);
      }
    }
  }, gameVelocity);
}

//Move a pawn (pacman or ghost) left on the grid until an obstacle is met
function moveLeft(pawn) {
  pawn.mvtTimer = setInterval(() => {
    const collision = detectCollision(
      pawn.gridCoord.columnStart - 1,
      pawn.gridCoord.rowStart
    );
    if (collision === false) {
      shiftLeft(pawn);
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        shiftLeft(pawn);
      } else {
        clearInterval(pawn.mvtTimer);
      }
    }
  }, gameVelocity);
}

function movePacman(evt) {
  clearInterval(pacman.mvtTimer);
  const pressedKey = evt.key;
  if (pressedKey === "ArrowLeft") {
    moveLeft(pacman);
  } else if (pressedKey === "ArrowRight") {
    moveRight(pacman);
  } else if (pressedKey === "ArrowUp") {
    moveTop(pacman);
  } else if (pressedKey === "ArrowDown") {
    moveDown(pacman);
  }
}

document.onkeydown = movePacman;
