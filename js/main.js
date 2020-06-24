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

//Constant used within move functions to define the velocity of pacman and ghosts
const gameVelocity = 100;
//Delay between the release of each ghost
const ghostDelay = 2000;
//Menu display delay
const menuDelay = 2000;

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

const pacman = new Pawn("pacman", {
  initRowStart: 11,
  initRowEnd: 12,
  initColStart: 10,
  initColEnd: 11,
});
const inky = new Pawn("inky", {
  initRowStart: 10,
  initRowEnd: 11,
  initColStart: 9,
  initColEnd: 10,
});
const pinky = new Pawn("pinky", {
  initRowStart: 9,
  initRowEnd: 10,
  initColStart: 11,
  initColEnd: 12,
});
const blinky = new Pawn("blinky", {
  initRowStart: 9,
  initRowEnd: 10,
  initColStart: 9,
  initColEnd: 10,
});
const clyde = new Pawn("clyde", {
  initRowStart: 10,
  initRowEnd: 11,
  initColStart: 11,
  initColEnd: 12,
});
const pawnArr = [pacman, inky, pinky, blinky, clyde];

const timerArr = {
  timers: [],
  addTimer: function (timer) {
    this.timers.push(timer);
  },
  clearAllTimers: function () {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }
};

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

function endGameWon(){
  stopPawns();
  timerArr.clearAllTimers();
  displayHighScore();
  setTimeout(displayGameWon, menuDelay);
}

//When pacman move on a light ball, remove it from the grid and increase the score
function eatLightBall(elmt) {
  elmt.remove();
  updateScore(10);
  if (checkIfWin()) {
    endGameWon();
  }
}

//Remove class inactive from the ghost div. This class is to avoid wrong collision management when ghosts are not out of their spawn box
function toggleGhostActivation(elmt) {
  elmt.classList.toggle("inactive");
}

function stopPawns() {
  pawnArr.forEach((pawn) => {
    clearInterval(pawn.mvtTimer);
  });
}

function displayHighScore(){
  player.updateHighScore();
  document.getElementById("high-score").textContent = String(player.highScore);
}

function endGameOver() {
  setTimeout(displayGameOver, menuDelay);
  displayHighScore();
}

function loose1Up() {
  player.remove1Up();
  const lifeIconArr = document.querySelectorAll(".heart");
  lifeIconArr[lifeIconArr.length - 1].remove();
}

function resetPawns() {
  pawnArr.forEach((pawn) => {
    pawn.resetCoord();
    if (pawn.elmt().classList.contains("ghost")) {
      toggleGhostActivation(pawn.elmt());
      pawn.previousMove = "top";
    }
  });
}

function getCaught() {
  loose1Up();
  stopPawns();
  timerArr.clearAllTimers();
  if (player.checkGameOver() === false) {
    setTimeout(resetPawns, 2000);
    setTimeout(releaseGhosts, 2000);
  } else {
    endGameOver();
  }
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
  for (let i = 0; i < dirArr.length; i++) {
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
  }
  return dirArr;
}

//Remove the opposite direction of the previous move
function avoidComeBack(ghost, dirArr) {
  if (ghost.previousMove === "top") {
    dirArr.splice(2, 1);
  } else if (ghost.previousMove === "right") {
    dirArr.splice(3, 1);
  } else if (ghost.previousMove === "down") {
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
  if (
    pacman.gridCoord.rowStart === ghost.gridCoord.rowStart &&
    pacman.gridCoord.columnStart === ghost.gridCoord.columnStart
  ) {
    getCaught();
  }
}

function moveGhostRandom(ghost) {
  ghost.mvtTimer = setInterval(
    shiftGhostRandom.bind(this, ghost),
    gameVelocity
  );
}

function releaseBlinky() {
  let timer = null;
  timer = setTimeout(blinky.shiftRight.bind(blinky), gameVelocity);
  timerArr.addTimer(timer);
  timer = setTimeout(blinky.shiftTop.bind(blinky), gameVelocity * 2);
  timerArr.addTimer(timer);
  toggleGhostActivation(blinky.elmt());
  timer = setTimeout(moveGhostRandom.bind(this, blinky), gameVelocity * 3);
  timerArr.addTimer(timer);
}

function releasePinky() {
  let timer = null;
  timer = setTimeout(pinky.shiftLeft.bind(pinky), gameVelocity);
  timerArr.addTimer(timer);
  timer = setTimeout(pinky.shiftTop.bind(pinky), gameVelocity * 2);
  timerArr.addTimer(timer);
  toggleGhostActivation(pinky.elmt());
  timer = setTimeout(moveGhostRandom.bind(this, pinky), gameVelocity * 3);
  timerArr.addTimer(timer);
}

function releaseInky() {
  let timer = null;
  timer = setTimeout(inky.shiftRight.bind(inky), gameVelocity);
  timerArr.addTimer(timer);
  timer = setTimeout(inky.shiftTop.bind(inky), gameVelocity * 2);
  timerArr.addTimer(timer);
  timer = setTimeout(inky.shiftTop.bind(inky), gameVelocity * 3);
  timerArr.addTimer(timer);
  toggleGhostActivation(inky.elmt());
  timer = setTimeout(moveGhostRandom.bind(this, inky), gameVelocity * 4);
  timerArr.addTimer(timer);
}

function releaseClyde() {
  let timer = null;
  timer = setTimeout(clyde.shiftLeft.bind(clyde), gameVelocity);
  timerArr.addTimer(timer);
  timer = setTimeout(clyde.shiftTop.bind(clyde), gameVelocity * 2);
  timerArr.addTimer(timer);
  timer = setTimeout(clyde.shiftTop.bind(clyde), gameVelocity * 3);
  timerArr.addTimer(timer);
  toggleGhostActivation(clyde.elmt());
  timer = setTimeout(moveGhostRandom.bind(this, clyde), gameVelocity * 4);
  timerArr.addTimer(timer);
}

function releaseGhosts() {
  let timer = null;
  timer = setTimeout(releaseBlinky, ghostDelay);
  timerArr.addTimer(timer);
  timer = setTimeout(releasePinky, ghostDelay * 2);
  timerArr.addTimer(timer);
  timer = setTimeout(releaseInky, ghostDelay * 3);
  timerArr.addTimer(timer);
  timer = setTimeout(releaseClyde, ghostDelay * 4);
  timerArr.addTimer(timer);
}

function startGame() {
  displayGame();
  releaseGhosts();
}

function resetGame(){
  resetPawns();
  displayLightBalls();
  displayRestartedGame();
  releaseGhosts();
}

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

document.getElementById("btn-start").onclick = startGame;
document.getElementById("btn-play-again").onclick = resetGame;
document.querySelector("body").onkeydown = pauseGame;
