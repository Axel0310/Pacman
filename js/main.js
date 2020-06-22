import { Player } from "./player.js";
import { Pacman } from "./pacman.js";

const player = new Player();

const pacmanElmt = document.getElementById("pacman");
const pacman = new Pacman(pacmanElmt);

const borderRect = document.querySelector(".border-test").getBoundingClientRect();



function movePacman(evt){
  pacman.stop();
  const pressedKey = evt.key;
  if (pressedKey === "ArrowLeft") {
    pacman.movePacmanLeft(borderRect);
  } else if (pressedKey === "ArrowRight") {
    pacman.movePacmanRight(borderRect);
  } else if (pressedKey === "ArrowUp") {
    pacman.movePacmanUp(borderRect);
  } else if (pressedKey === "ArrowDown") {
    pacman.movePacmanDown(borderRect);
  }
};

document.onkeydown = movePacman;
