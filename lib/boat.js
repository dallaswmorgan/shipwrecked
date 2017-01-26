const MovingObject = require('./moving_object');
const Util = require('./util');
class Boat extends MovingObject {
  constructor(options) {
    options.vel = options.vel || [0,0];
    options.pos = options.pos || [250, 250];
    options.radius = 10;
    options.color = "orange";
    options.img = document.getElementById('boat');
    super(options);
    this.angle = 0;
  }

  power(impulse) {
    if (this.vel[0] + impulse[0] < 5) {
      this.vel[0] += impulse[0];
    }
    if (this.vel[1] + impulse[1] < 5) {
      this.vel[1] += impulse[1];
    }
  }

  dampen() {
    this.vel[0] = this.vel[0] * 0.99;
    this.vel[1] = this.vel[1] * 0.99;
  }



  draw(ctx) {
    ctx.drawImage(this.img, this.pos[0] - 10, this.pos[1] - 15, 20, 30);
  }
}

module.exports = Boat;
