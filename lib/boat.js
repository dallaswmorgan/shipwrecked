const MovingObject = require('./moving_object');
const Util = require('./util');

class Boat extends MovingObject {
  constructor(options) {
    options.vel = options.vel || [0,500];
    options.pos = options.pos || [250, 250];
    options.radius = 25;
    options.color = "orange";
    super(options);
  }

  power(impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  }
}

module.exports = Boat;
