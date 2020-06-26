export class Player {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.life = 3;
  }

  increaseScore(nb) {
    this.score += nb;
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  remove1Up() {
    this.life--;
  }

  add1Up() {
    if (this.life < 3) this.life++;
  }

  checkGameOver() {
    return this.life === 0;
  }

  resetPlayer() {
    this.score = 0;
    this.life = 3;
  }
}
