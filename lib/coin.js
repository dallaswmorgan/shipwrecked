const MovingObject = require('./moving_object');

class Coin extends MovingObject {
  constructor(options) {
    options.radius = 5;
    options.vel = [0, 0];
    options.color = "yellow";
    super(options);
  }
}

module.exports = Coin;
