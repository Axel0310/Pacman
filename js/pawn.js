import { getGridCoord } from "./main.js";

export class Pawn {
  constructor(elmtId) {
    this.id = elmtId;
    this.elmt = () => document.getElementById(elmtId);
    this.mvtTimer = null;
    this.gridCoord = getGridCoord(document.getElementById(elmtId));
    this.previousMove = "top";
  }

  //Move a pawn (pacman or ghost) 1 cell up on the grid
  shiftTop() {
    this.gridCoord.rowStart--;
    this.gridCoord.rowEnd--;
    this.elmt().style.gridRowStart = String(this.gridCoord.rowStart);
    this.elmt().style.gridRowEnd = String(this.gridCoord.rowEnd);
  }

  //Move a pawn (pacman or ghost) 1 cell right on the grid
  shiftRight() {
    this.gridCoord.columnStart++;
    if (this.gridCoord.columnStart === 20) this.gridCoord.columnStart = 1;
    this.gridCoord.columnEnd = this.gridCoord.columnStart + 1;
    this.elmt().style.gridColumnStart = String(this.gridCoord.columnStart);
    this.elmt().style.gridColumnEnd = String(this.gridCoord.columnEnd);
  }

  //Move a pawn (pacman or ghost) 1 cell down on the grid
  shiftDown() {
    this.gridCoord.rowStart++;
    this.gridCoord.rowEnd++;
    this.elmt().style.gridRowStart = String(this.gridCoord.rowStart);
    this.elmt().style.gridRowEnd = String(this.gridCoord.rowEnd);
  }

  //Move a pawn (pacman or ghost) 1 cell left on the grid
  shiftLeft() {
    this.gridCoord.columnStart--;
    if (this.gridCoord.columnStart === 0) this.gridCoord.columnStart = 19;
    this.gridCoord.columnEnd = this.gridCoord.columnStart + 1;
    this.elmt().style.gridColumnStart = String(this.gridCoord.columnStart);
    this.elmt().style.gridColumnEnd = String(this.gridCoord.columnEnd);
  }
}
