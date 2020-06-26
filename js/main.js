import {
  displayGame,
  displayRestartedGame,
  // togglePause,
  displayGameOver,
  displayGameWon,
} from "./page_animations.js";
import { Player } from "./player.js";
import { Pawn } from "./pawn.js";

const player = new Player();

//Constant used within move functions to define the velocity of pacman and ghosts
const gameVelocity = 350;
//Delay between the release of each ghost
const ghostDelay = 2000;
//Menu display delay
const menuDelay = 2000;
//Period when ghost can be caught
const ghostPreyPeriod = 10000;

let removeGhostPreyTimer = null;
let warningTimer = null;
let warningTimerDelay = null;

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

const pacman = new Pawn(
  "pacman",
  {
    initRowStart: 11,
    initRowEnd: 12,
    initColStart: 10,
    initColEnd: 11,
  },
  [
    "./style/images/pacman-top.png",
    "./style/images/pacman-right.png",
    "./style/images/pacman-down.png",
    "./style/images/pacman-left.png",
  ]
);
const inky = new Pawn(
  "inky",
  {
    initRowStart: 10,
    initRowEnd: 11,
    initColStart: 9,
    initColEnd: 10,
  },
  [
    "./style/images/inky-top.png",
    "./style/images/inky-right.png",
    "./style/images/inky-down.png",
    "./style/images/inky-left.png",
  ]
);
const pinky = new Pawn(
  "pinky",
  {
    initRowStart: 9,
    initRowEnd: 10,
    initColStart: 11,
    initColEnd: 12,
  },
  [
    "./style/images/pinky-top.png",
    "./style/images/pinky-right.png",
    "./style/images/pinky-down.png",
    "./style/images/pinky-left.png",
  ]
);
const blinky = new Pawn(
  "blinky",
  {
    initRowStart: 9,
    initRowEnd: 10,
    initColStart: 9,
    initColEnd: 10,
  },
  [
    "./style/images/blinky-top.png",
    "./style/images/blinky-right.png",
    "./style/images/blinky-down.png",
    "./style/images/blinky-left.png",
  ]
);
const clyde = new Pawn(
  "clyde",
  {
    initRowStart: 10,
    initRowEnd: 11,
    initColStart: 11,
    initColEnd: 12,
  },
  [
    "./style/images/clyde-top.png",
    "./style/images/clyde-right.png",
    "./style/images/clyde-down.png",
    "./style/images/clyde-left.png",
  ]
);
const pawnArr = [pacman, inky, pinky, blinky, clyde];

const timerArr = {
  timers: [],
  addTimer: function (timer) {
    this.timers.push(timer);
  },
  clearAllTimers: function () {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  },
};

function removeRemainingPowerBalls() {
  const powerBallArr = Array.from(document.querySelectorAll(".powerball"));
  powerBallArr.forEach((pb) => {
    pb.remove();
  });
}

//Create div corresponding to light balls and powerballs and display them on the grid
function displayLightBalls() {
  removeRemainingPowerBalls();
  const gameWindow = document.getElementById("game-window");
  gameWindow.innerHTML += `<div id="powerball-1" class="element ball powerball" style="grid-row: 4 / 5; grid-column: 5 / 6;"></div>
  <div id="powerball-2" class="element ball powerball" style="grid-row: 4 / 5; grid-column: 15 / 16;"></div>
  <div id="powerball-3" class="element ball powerball" style="grid-row: 16 / 17; grid-column: 5 / 6;"></div>
  <div id="powerball-4" class="element ball powerball" style="grid-row: 16 / 17; grid-column: 15 / 16;"></div>`;
  const initialGameElmtArr = Array.from(document.querySelectorAll(".element"));
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

function endGameWon() {
  stopPawns();
  timerArr.clearAllTimers();
  displayHighScore();
  setTimeout(displayGameWon, menuDelay);
  togglePawnActivation(pacman.elmt());
}

function updateScore(nb = 0) {
  player.increaseScore(nb);
  document.getElementById("score").textContent = String(player.score);
}

function removeGhostPrey(ghostElmt = null) {
  if (ghostElmt === null) {
    if (warningTimer !== null) {
      clearInterval(warningTimer);
    }
    pawnArr.forEach((pawn) => {
      if (pawn.id !== "pacman") {
        pawn.elmt().classList.remove("prey");
        pawn.elmt().classList.remove("scared");
      }
    });
  } else {
    ghostElmt.classList.remove("prey");
    ghostElmt.classList.remove("scared");
  }
}

function warnEndOfEnergizer() {
  const ghostInPreyArr = pawnArr.filter((pawn) =>
    pawn.elmt().classList.contains("prey")
  );
  ghostInPreyArr.forEach((pawn) => {
    pawn.elmt().classList.remove("scared");
  });
  warningTimer = setInterval(() => {
    ghostInPreyArr.forEach((pawn) => {
      pawn.elmt().classList.toggle("scared");
    });
  }, 250);
}

function makeGhostPrey() {
  if (removeGhostPreyTimer !== null) {
    clearTimeout(removeGhostPreyTimer);
  }
  if (warningTimer !== null) {
    clearInterval(warningTimer);
  }
  if (warningTimerDelay != null) {
    clearTimeout(warningTimerDelay);
  }
  pawnArr.forEach((pawn) => {
    if (pawn.id !== "pacman") {
      pawn.elmt().classList.add("prey");
      pawn.elmt().classList.add("scared");
    }
  });
  let timer = setTimeout(removeGhostPrey, ghostPreyPeriod);
  removeGhostPreyTimer = timer;
  timerArr.addTimer(timer);
  timer = setTimeout(warnEndOfEnergizer, ghostPreyPeriod - 3000);
  warningTimerDelay = timer;
  timerArr.addTimer(timer);
}

//When pacman move on a light ball, remove it from the grid and increase the score
function eatLightBall(elmt) {
  elmt.remove();
  //If it is a powerball make the ghosts the preys
  if (elmt.classList.contains("powerball")) {
    updateScore(50);
    makeGhostPrey();
  } else {
    updateScore(10);
  }
  if (checkIfWin()) {
    endGameWon();
  }
}

//Remove class inactive from the ghost div. This class is to avoid wrong collision management when ghosts are not out of their spawn box
function togglePawnActivation(elmt) {
  elmt.classList.toggle("inactive");
}

function stopPawns() {
  pawnArr.forEach((pawn) => {
    clearInterval(pawn.mvtTimer);
  });
  timerArr.clearAllTimers();
}

function displayHighScore() {
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

function resetLifeDisplay() {
  const lifeDiv = document.getElementById("life");
  lifeDiv.innerHTML = `<span class="heart"><i class="fas fa-heart"></i></span>
  <span class="heart"><i class="fas fa-heart"></i></span>
  <span class="heart"><i class="fas fa-heart"></i></span>`;
}

function resetPawns() {
  pawnArr.forEach((pawn) => {
    pawn.resetCoord();
    if (pawn.elmt().classList.contains("ghost")) {
      togglePawnActivation(pawn.elmt());
      pawn.previousMove = "top";
    }
  });
  removeGhostPrey();
  togglePawnActivation(pacman.elmt());
}

function resetGhost(ghostElmt) {
  const ghost = pawnArr.filter((pawn) => pawn.id === ghostElmt.id)[0];
  clearInterval(ghost.mvtTimer);
  ghost.resetCoord();
  togglePawnActivation(ghostElmt);
  ghost.previousMove = "top";
  removeGhostPrey(ghostElmt);
  let timer = null;
  if (ghost.id === "inky") {
    timer = setTimeout(releaseInky, ghostDelay);
  } else if (ghost.id === "pinky") {
    timer = setTimeout(releasePinky, ghostDelay);
  } else if (ghost.id === "blinky") {
    timer = setTimeout(releaseBlinky, ghostDelay);
  } else {
    timer = setTimeout(releaseClyde, ghostDelay);
  }
  timerArr.addTimer(timer);
}

function getCaught() {
  togglePawnActivation(pacman.elmt());
  loose1Up();
  stopPawns();
  if (player.checkGameOver() === false) {
    setTimeout(resetPawns, 2000);
    setTimeout(releaseGhosts, 2000);
  } else {
    endGameOver();
  }
}

function eatGhost(ghostElmt) {
  updateScore(200);
  resetGhost(ghostElmt);
}

//Array containing all the elements in the game window (pacman, ghosts, balls, borders)
let gameElmtArr = Array.from(document.querySelectorAll(".element"));
let gameBorderArr = Array.from(document.querySelectorAll(".border,.pacman"));

function updateElmtArr() {
  gameElmtArr = Array.from(document.querySelectorAll(".element"));
  gameBorderArr = Array.from(document.querySelectorAll(".border,.pacman"));
}

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
      } else if (el.classList.contains("prey")) {
        eatGhost(el);
        return true;
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

//Take the keyboard input to change the direction of Pacman
function movePacman(evt) {
  if (pacman.elmt().classList.contains("inactive") === false) {
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
    if (ghost.elmt().classList.contains("prey") === false) {
      getCaught();
    } else {
      eatGhost(ghost.elmt());
    }
  }
}

function moveGhostRandom(ghost) {
  ghost.mvtTimer = setInterval(
    shiftGhostRandom.bind(this, ghost),
    gameVelocity
  );
}

//Next 5 functions are used to make the ghosts move out of their spawn box
function releaseBlinky() {
  let timer = null;
  timer = setTimeout(blinky.shiftRight.bind(blinky), gameVelocity);
  timerArr.addTimer(timer);
  timer = setTimeout(blinky.shiftTop.bind(blinky), gameVelocity * 2);
  timerArr.addTimer(timer);
  togglePawnActivation(blinky.elmt());
  timer = setTimeout(moveGhostRandom.bind(this, blinky), gameVelocity * 3);
  timerArr.addTimer(timer);
}

function releasePinky() {
  let timer = null;
  timer = setTimeout(pinky.shiftLeft.bind(pinky), gameVelocity);
  timerArr.addTimer(timer);
  timer = setTimeout(pinky.shiftTop.bind(pinky), gameVelocity * 2);
  timerArr.addTimer(timer);
  togglePawnActivation(pinky.elmt());
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
  togglePawnActivation(inky.elmt());
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
  togglePawnActivation(clyde.elmt());
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
  togglePawnActivation(pacman.elmt());
  releaseGhosts();
}

function resetGame() {
  resetPawns();
  displayLightBalls();
  updateElmtArr();
  displayRestartedGame();
  player.resetPlayer();
  updateScore();
  resetLifeDisplay();
  releaseGhosts();
}

// function pauseGame(evt) {
//   if (
//     evt.repeat === false &&
//     evt.key === " " &&
//     document.getElementById("btn-start").classList.contains("not-displayed")
//   ) {
//     togglePause();
//     stopPawns();
//     togglePawnActivation(pacman.elmt());
//   }
// }

document.onkeydown = movePacman;

document.getElementById("btn-start").onclick = startGame;
document.getElementById("btn-play-again").onclick = resetGame;
// document.querySelector("body").onkeydown = pauseGame;
