export class Pacman {
  constructor(pacmanElmt) {
    this.pacmanElmt = pacmanElmt;
    this.moveTimer = null;
    this.rect = pacmanElmt.getBoundingClientRect();
    this.velocity = 10;
  }

  updateRect() {
    this.rect = this.pacmanElmt.getBoundingClientRect();
  }

  moveLeft() {
    let currentLeft = Number(
      window.getComputedStyle(this.pacmanElmt).left.match(/\d+/g)[0]
    );
    this.pacmanElmt.style.left = `${currentLeft - 1}px`;
    this.updateRect();
  }

  moveRight() {
    let currentLeft = Number(
      window.getComputedStyle(this.pacmanElmt).left.match(/\d+/g)[0]
    );
    this.pacmanElmt.style.left = `${currentLeft + 1}px`;
    this.updateRect();
  }

  moveUp() {
    let currentTop = Number(
      window.getComputedStyle(this.pacmanElmt).top.match(/\d+/g)[0]
    );
    this.pacmanElmt.style.top = `${currentTop - 1}px`;
    this.updateRect();
  }

  moveDown() {
    let currentTop = Number(
      window.getComputedStyle(this.pacmanElmt).top.match(/\d+/g)[0]
    );
    this.pacmanElmt.style.top = `${currentTop + 1}px`;
    this.updateRect();
  }

  stop() {
    clearInterval(this.moveTimer);
  }

  //Receive 2 DOMRect objects
  detectCollisionTop(rect2) {
    if (
      this.rect.y === rect2.bottom &&
      this.rect.right > rect2.x &&
      this.rect.x < rect2.right
    ) {
      console.log("Collision top detected");
      return true;
    } else return false;
  }

  detectCollisionBottom(rect2) {
    console.log(rect2)
    if (
      this.rect.bottom === rect2.y &&
      this.rect.right > rect2.x &&
      this.rect.x < rect2.right
    ) {
      console.log("Collision bottom detected");
      return true;
    } else return false;
  }

  detectCollisionLeft(rect2) {
    if (
      this.rect.x === rect2.right &&
      this.rect.bottom > rect2.y &&
      this.rect.y < rect2.bottom
    ) {
      console.log("Collision left detected");
      return true;
    } else return false;
  }

  detectCollisionRight(rect2) {
    if (
      this.rect.right === rect2.x &&
      this.rect.bottom > rect2.y &&
      this.rect.y < rect2.bottom
    ) {
      console.log("Collision right detected");
      return true;
    } else return false;
  }

  movePacmanLeft(block) {
    this.moveTimer = setInterval(() => {
      if (this.detectCollisionLeft(block) === false) {
        this.moveLeft();
      } else {
        this.stop();
      }
    }, this.velocity);
  }

  movePacmanRight(block) {
    this.moveTimer = setInterval(() => {
      if (this.detectCollisionRight(block) === false) {
        this.moveRight();
      } else {
        this.stop();
      }
    }, this.velocity);
  }

  movePacmanUp(block) {
    this.moveTimer = setInterval(() => {
      if (this.detectCollisionTop(block) === false) {
        this.moveUp();
      } else {
        this.stop();
      }
    }, this.velocity);
  }

  movePacmanDown(block) {
    this.moveTimer = setInterval(() => {
      if (this.detectCollisionBottom(block) === false) {
        this.moveDown();
      } else {
        this.stop();
      }
    }, this.velocity);
  }
}
