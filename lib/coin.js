const MovingObject = require('./moving_object');
const Boat = require('./boat');


class Coin extends MovingObject {
  constructor(options) {
    options.radius = 200;
    options.vel = [0, 0];
    options.color = "yellow";
    super(options);
  }

  collideWith(otherObject) {
    if (otherObject instanceof Boat) {
      playSound2();
      this.remove();
      this.game.addCoin();
      return true;
    }
  }
}

module.exports = Coin;
