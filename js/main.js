import {
  displayGame,
  displayRestartedGame,
  togglePause,
  displayGameOver,
  displayGameWon,
} from "./page_animations.js";
import { Player } from "./player.js";
import { Pawn } from "./pawn.js";

const player = new Player();

function updateScore(nb) {
  player.increaseScore(nb);
  document.getElementById("score").textContent = String(player.score);
}

const pacmanElmt = document.getElementById("pacman");

//Constant used within move functions to define the velocity of pacman and ghosts
const gameVelocity = 50;

//Function returning an object with the grid position of an element
export function getGridCoord(elmt) {
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
// const pacman = {
//   elmt: () => document.getElementById("pacman"),
//   mvtTimer: null,
//   gridCoord: getGridCoord(pacmanElmt),
// };

const pacman = new Pawn("pacman");
const inky = new Pawn("inky");
const pinky = new Pawn("pinky");
const blinky = new Pawn("blinky");
const clyde = new Pawn("clyde");
const pawnArr = [pacman, inky, pinky, blinky, clyde];

//Create div corresponding to light balls and display them on the grid
function displayLightBalls() {
  const gameWindow = document.getElementById("game-window");
  const initialGameElmtArr = Array.from(
    document.querySelectorAll(".border, #pacman, .ghost")
  );
  const gridCoordArr = initialGameElmtArr.map((elmt) => getGridCoord(elmt));
  for (let x = 2; x < 19; x++) {
    for (let y = 2; y < 19; y++) {
      const cellIsOccupied = gridCoordArr.reduce((acc, elmt) => {
        if (
          x < elmt.columnEnd &&
          x + 1 > elmt.columnStart &&
          y < elmt.rowEnd &&
          y + 1 > elmt.rowStart
        ) {
          return true;
        } else return acc;
      }, false);
      if (cellIsOccupied === false) {
        gameWindow.innerHTML += `<div id="ball-${x}-${y}" class="element ball" style="grid-row: ${y}; grid-column: ${x}"></div>`;
      }
    }
  }
}

displayLightBalls();

//Check if there is still at least 1 ligth ball to catch
function checkIfWin() {
  const remainingLightBall = document.querySelectorAll(".ball");
  if (remainingLightBall.length === 0) {
    return true;
  } else return false;
}

//When pacman move on a light ball, remove it from the grid and increase the score
function eatLightBall(elmt) {
  elmt.remove();
  updateScore(10);
  if (checkIfWin()) {
    displayGameWon();
  }
}

//Remove class inactive from the ghost div. This class is to avoid wrong collision management when ghosts are not out of their spawn box
function toggleGhostActivation(elmt) {
  elmt.classList.toggle("inactive");
}

function releaseInky() {
  setTimeout(inky.shiftRight.bind(inky), gameVelocity);
  setTimeout(inky.shiftTop.bind(inky), gameVelocity * 2);
  toggleGhostActivation(inky.elmt());
}

function releasePinky() {
  setTimeout(pinky.shiftLeft.bind(pinky), gameVelocity);
  setTimeout(pinky.shiftTop.bind(pinky), gameVelocity * 2);
  toggleGhostActivation(pinky.elmt());
}

function releaseBlinky() {
  setTimeout(blinky.shiftRight.bind(blinky), gameVelocity);
  setTimeout(blinky.shiftTop.bind(blinky), gameVelocity * 2);
  setTimeout(blinky.shiftTop.bind(blinky), gameVelocity * 3);
  toggleGhostActivation(blinky.elmt());
}

function releaseClyde() {
  setTimeout(clyde.shiftLeft.bind(clyde), gameVelocity);
  setTimeout(clyde.shiftTop.bind(clyde), gameVelocity * 2);
  setTimeout(clyde.shiftTop.bind(clyde), gameVelocity * 3);
  toggleGhostActivation(clyde.elmt());
}

function stopPawns() {
  pawnArr.forEach((pawn) => {
    clearInterval(pawn.mvtTimer);
  });
}

function endGame() {
  stopPawns();
  setTimeout(displayGameOver, 1000);
}

function loose1Up() {
  player.remove1Up();
  const lifeIconArr = document.querySelectorAll(".heart");
  lifeIconArr[lifeIconArr.length - 1].remove();
  if (player.checkGameOver() === true) {
    console.log("Game over");
    endGame();
  }
}

function getCaught() {
  loose1Up();
}

//Array containing all the elements in the game window (pacman, ghosts, balls, borders)
const gameElmtArr = Array.from(document.querySelectorAll(".element"));
const gameBorderArr = Array.from(document.querySelectorAll(".border,.pacman"));

//Check if the next cell of the pawn has already an element. If yes return the element already there, if no return false
function detectCollision(pawn, pawnColStart, pawnRowStart) {
  if (pawn.id === "pacman") {
    var elmtArr = gameElmtArr;
  } else {
    var elmtArr = gameBorderArr;
  }
  //From the array of all elements in the grid, check if there is one in the next left cell
  const obstacleArr = elmtArr.filter((elmt) => {
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
function checkCollisionElmt(pawn, el) {
  if (el.classList.contains("border")) {
    return false;
  } else if (pawn.id === "pacman") {
    if (el.classList.contains("ball")) {
      eatLightBall(el);
      return true;
    } else if (el.classList.contains("ghost")) {
      if (el.classList.contains("inactive")) {
        return false;
      } else {
        getCaught();
        return true;
      }
    }
  } else if (pawn.elmt.classList.contains("ghost")) {
    if (el.classList.contains("pacman")) {
      getCaught();
      return true;
    } else return true;
  }
}

//Move a pawn (pacman or ghost) up on the grid until an obstacle is met
function moveTop(pawn) {
  pawn.mvtTimer = setInterval(() => {
    const collision = detectCollision(
      pawn,
      pawn.gridCoord.columnStart,
      pawn.gridCoord.rowStart - 1
    );
    if (collision === false) {
      pawn.shiftTop();
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        pawn.shiftTop();
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
      pawn,
      pawn.gridCoord.columnStart + 1,
      pawn.gridCoord.rowStart
    );
    if (collision === false) {
      pawn.shiftRight();
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        pawn.shiftRight();
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
      pawn,
      pawn.gridCoord.columnStart,
      pawn.gridCoord.rowStart + 1
    );
    if (collision === false) {
      pawn.shiftDown();
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        pawn.shiftDown();
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
      pawn,
      pawn.gridCoord.columnStart - 1,
      pawn.gridCoord.rowStart
    );
    if (collision === false) {
      pawn.shiftLeft();
    } else {
      const collisionOutcome = checkCollisionElmt(pawn, collision);
      if (collisionOutcome === true) {
        pawn.shiftLeft();
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

function checkGhostPossibleMove(ghost, dirArr) {
  for(let i = 0; i < dirArr.length; i++){
    var obstacle = null;
    if (dirArr[i] === "top") {
      obstacle = detectCollision(
        ghost,
        ghost.gridCoord.columnStart,
        ghost.gridCoord.rowStart - 1
      );
    } else if (dirArr[i] === "right") {
      obstacle = detectCollision(
        ghost,
        ghost.gridCoord.columnStart + 1,
        ghost.gridCoord.rowStart
      );
    } else if (dirArr[i] === "down") {
      obstacle = detectCollision(
        ghost,
        ghost.gridCoord.columnStart,
        ghost.gridCoord.rowStart + 1
      );
    } else if (dirArr[i] === "left") {
      obstacle = detectCollision(
        ghost,
        ghost.gridCoord.columnStart - 1,
        ghost.gridCoord.rowStart
      );
    }
    if (obstacle !== false) {
      if (obstacle.classList.contains("border")) {
        dirArr.splice(i, 1);
        i--;
      }
    }
  };
  return dirArr;
}

//Remove the opposite direction of the previous move
function avoidComeBack(ghost, dirArr){
  if(ghost.previousMove === "top"){
    dirArr.splice(2, 1);
  } else if (ghost.previousMove === "right"){
    dirArr.splice(3, 1);
  } else if (ghost.previousMove === "down"){
    dirArr.splice(0, 1);
  } else {
    dirArr.splice(1, 1);
  }
  return dirArr;
}

function shiftGhostRandom(ghost) {
  let possibleDirection = ["top", "right", "down", "left"];
  possibleDirection = avoidComeBack(ghost, possibleDirection);
  possibleDirection = checkGhostPossibleMove(ghost, possibleDirection);
  const randIndex = Math.floor(Math.random() * possibleDirection.length);
  const randDir = possibleDirection[randIndex];
  if (randDir === "top") {
    ghost.shiftTop();
    ghost.previousMove = "top";
  } else if (randDir === "right") {
    ghost.shiftRight();
    ghost.previousMove = "right";
  } else if (randDir === "down") {
    ghost.shiftDown();
    ghost.previousMove = "down";
  } else if (randDir === "left") {
    ghost.shiftLeft();
    ghost.previousMove = "left";
  }
}


function moveGhostRandom(ghost) {
  ghost.mvtTimer = setInterval(
    shiftGhostRandom.bind(this, ghost),
    gameVelocity
  );
}

// moveGhostRandom(inky);

function pauseGame(evt) {
  if (
    evt.repeat === false &&
    evt.key === " " &&
    document.getElementById("btn-start").classList.contains("not-displayed")
  ) {
    togglePause();
    stopPawns();
  }
}

document.onkeydown = movePacman;

document.getElementById("btn-start").onclick = displayGame;
document.getElementById("btn-play-again").onclick = displayRestartedGame;
document.querySelector("body").onkeydown = pauseGame;

//For dev purpose, to be removed
displayGame();
