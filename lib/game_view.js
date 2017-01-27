const Game = require('./game');
class GameView {
  constructor(game, ctx, highScore = 0) {
    this.ctx = ctx;
    this.game = game;
    this.game.ctx = ctx;
    this.boat = this.game.boat;
    this.coin = this.game.addCoin();
    this.paused = false;
    this.highScore = highScore;
    document.addEventListener('keydown', e => {
      e.preventDefault();

      if (e.code === "Space") {
        let message = document.getElementById('showing');
        if (message) {
          message.id = "hidden";
          this.game = new Game();
          // this.coin = this.game.addCoin();
          this.boat = this.game.boat;
          const newGame = new GameView(this.game, this.ctx, this.highScore);
          newGame.start();
        }
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
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    if (this.game.lost()) {
      this.animateLoss();
    } else {
      this.boat.dampen();
      this.game.step(timeDelta);
      this.game.draw(this.ctx);
      this.lastTime = time;
      this.renderScore();
    }
    requestAnimationFrame(this.animate.bind(this));
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
