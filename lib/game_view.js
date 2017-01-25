
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.boat = this.game.addBoat();
    this.coin = this.game.addCoin();
    this.game.addMine();
  }

  bindKeyHandlers() {
    const boat = this.boat;

    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, () => { boat.power(move); });
    });

  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  "up": [ 0, -1],
  "left": [-1,  0],
  "down": [ 0,  1],
  "right": [ 1,  0],
};

module.exports = GameView;
