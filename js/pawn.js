import { getGridCoord } from "./main.js";

export class Pawn {
  constructor(elmtId, initCoord, bgImg) {
    this.id = elmtId;
    this.elmt = () => document.getElementById(elmtId);
    this.mvtTimer = null;
    this.gridCoord = getGridCoord(document.getElementById(elmtId));
    this.previousMove = "top"; //Only used for ghosts
    this.initCoord = initCoord;
    this.bgImg = bgImg; //Contains [imgTop, imgRight, imgDown, imgLeft]
  }

  //Move a pawn (pacman or ghost) 1 cell up on the grid
  shiftTop() {
    this.gridCoord.rowStart--;
    this.gridCoord.rowEnd--;
    this.elmt().style.gridRowStart = String(this.gridCoord.rowStart);
    this.elmt().style.gridRowEnd = String(this.gridCoord.rowEnd);
    this.elmt().style.backgroundImage = `url(${this.bgImg[0]})`;
  }

  //Move a pawn (pacman or ghost) 1 cell right on the grid
  shiftRight() {
    this.gridCoord.columnStart++;
    if (this.gridCoord.columnStart === 20) this.gridCoord.columnStart = 1;
    this.gridCoord.columnEnd = this.gridCoord.columnStart + 1;
    this.elmt().style.gridColumnStart = String(this.gridCoord.columnStart);
    this.elmt().style.gridColumnEnd = String(this.gridCoord.columnEnd);
    this.elmt().style.backgroundImage = `url(${this.bgImg[1]})`;
  }

  //Move a pawn (pacman or ghost) 1 cell down on the grid
  shiftDown() {
    this.gridCoord.rowStart++;
    this.gridCoord.rowEnd++;
    this.elmt().style.gridRowStart = String(this.gridCoord.rowStart);
    this.elmt().style.gridRowEnd = String(this.gridCoord.rowEnd);
    this.elmt().style.backgroundImage = `url(${this.bgImg[2]})`;
  }

  //Move a pawn (pacman or ghost) 1 cell left on the grid
  shiftLeft() {
    this.gridCoord.columnStart--;
    if (this.gridCoord.columnStart === 0) this.gridCoord.columnStart = 19;
    this.gridCoord.columnEnd = this.gridCoord.columnStart + 1;
    this.elmt().style.gridColumnStart = String(this.gridCoord.columnStart);
    this.elmt().style.gridColumnEnd = String(this.gridCoord.columnEnd);
    this.elmt().style.backgroundImage = `url(${this.bgImg[3]})`;
  }

  resetCoord(){
    this.gridCoord.rowStart = this.initCoord.initRowStart;
    this.gridCoord.rowEnd = this.initCoord.initRowEnd;
    this.gridCoord.columnStart = this.initCoord.initColStart;
    this.gridCoord.columnEnd = this.initCoord.initColEnd;

    this.elmt().style.gridRowStart = String(this.gridCoord.rowStart);
    this.elmt().style.gridRowEnd = String(this.gridCoord.rowEnd);
    this.elmt().style.gridColumnStart = String(this.gridCoord.columnStart);
    this.elmt().style.gridColumnEnd = String(this.gridCoord.columnEnd);
  }

}
