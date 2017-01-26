const MovingObject = require('./moving_object');
const Boat = require('./boat');


class Coin extends MovingObject {
  constructor(options) {
    options.radius = 15;
    options.vel = [0, 0];
    options.color = "yellow";
    options.img = document.getElementById('coin');
    super(options);
  }

  collideWith(otherObject) {
    if (otherObject instanceof Boat) {
      playSound2();
      this.remove();
      this.game.increaseScore(5);
      this.game.addCoin();
      this.game.addMine();
      return true;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.pos[0] - 15, this.pos[1] - 15, 30, 30);
  }
}

module.exports = Coin;
