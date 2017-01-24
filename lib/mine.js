const Util = require('./util');
const MovingObject = require('./moving_object');
const Boat = require('./boat');


class Mine extends MovingObject {
  constructor(options = {}) {
    options.color = 'black';
    options.pos = options.pos || options.game.randomPosition();
    options.radius = 20;
    options.vel = options.vel || [0, 0];
    super(options);
  }


  collideWith(otherObject) {
    if (otherObject instanceof Boat) {
      otherObject.remove();
      this.remove();
      alert("BOOM");
      alert("Game Over");
      return true;
    } else if (otherObject instanceof Mine) {
      this.remove();
      otherObject.remove();
      alert("BOOM");
      return true;
    }
  }
}

module.exports = Mine;
