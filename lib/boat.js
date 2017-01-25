const MovingObject = require('./moving_object');
const Util = require('./util');
class Boat extends MovingObject {
  constructor(options) {
    options.vel = options.vel || [0,0];
    options.pos = options.pos || [250, 250];
    options.radius = 20;
    options.color = "orange";
    options.img = document.getElementById('boat');
    super(options);
  }

  power(impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.pos[0], this.pos[1], 20, 30);
  }
}

module.exports = Boat;
