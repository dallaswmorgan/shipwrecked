const Game = require('./game');
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.game.ctx = ctx;
    this.boat = this.game.boat;
    this.coin = this.game.addCoin();
    this.paused = false;
    this.highScore = 0
    document.addEventListener('keydown', e => {

      if (e.code === "Space") {
        let message = document.getElementById('showing');
        message.id = "hidden";
        this.game = new Game();
        this.coin = this.game.addCoin();
        this.boat = this.game.boat;
        this.start();
      }
    });
  }

  bindKeyHandlers() {
    const boat = this.boat;

    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, () => { boat.power(move); });
    });
  }



  renderScore() {
    if (this.game.score > this.highScore) {
      this.highScore = this.game.score;
    }
    document.getElementById('score').innerHTML = this.game.score;
    document.getElementById('high-score').innerHTML = this.highScore;
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  animateLoss() {
    debugger;
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    if (this.game.lost()) {
      debugger;
      this.animateLoss();
    } else {
      this.game.step(timeDelta);
      this.game.draw(this.ctx);
      this.lastTime = time;
      this.renderScore();
    }
    if (!this.paused) {

      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

GameView.MOVES = {
  "up": [ 0, -1],
  "left": [-1,  0],
  "down": [ 0,  1],
  "right": [ 1,  0],
  "w": [ 0, -1],
  "a": [-1,  0],
  "s": [ 0,  1],
  "d": [ 1,  0],
};

module.exports = GameView;
