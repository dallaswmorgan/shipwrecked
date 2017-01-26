const Util = require('./util');
const MovingObject = require('./moving_object');
const Boat = require('./boat');
const Coin = require('./coin');


class Mine extends MovingObject {
  constructor(options = {}) {
    options.pos = options.game.randomPosition();
    options.color = 'black';
    options.pos = options.pos || options.game.randomPosition();
    options.radius = 18;
    options.vel = options.vel || [0, -1];
    options.img = document.getElementById('mine');
    super(options);
  }


  collideWith(otherObject) {
    if (otherObject instanceof Boat) {
      playSound1();
      this.remove();
      otherObject.remove();
      return true;
    } else if (otherObject instanceof Mine) {
      this.game.increaseScore(10);
      playSound1();
      this.remove();
      otherObject.remove();
      return true;
    }
  }

  chase(targetPos) {
    let dist = Util.dist(this.pos, targetPos);
    this.dir = Util.dir(this.pos, targetPos);
    this.speed = 60 / dist;
    this.vel = Util.calcVel(this.dir, this.speed);
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.pos[0] - 18, this.pos[1] - 18, 36, 36);
  }
}

module.exports = Mine;
