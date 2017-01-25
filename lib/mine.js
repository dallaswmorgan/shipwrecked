const Util = require('./util');
const MovingObject = require('./moving_object');
const Boat = require('./boat');
const Coin = require('./coin');


class Mine extends MovingObject {
  constructor(options = {}) {
    options.color = 'black';
    options.pos = options.pos || options.game.randomPosition();
    options.radius = 10;
    options.vel = options.vel || [0, 0];
    options.img = document.getElementById('mine');
    super(options);
  }


  collideWith(otherObject) {
    if (otherObject instanceof Boat) {
      playSound1();
      this.remove();
      otherObject.remove();
      alert("Game Over");
      return true;
    } else if (otherObject instanceof Mine) {
      playSound1();
      this.remove();
      otherObject.remove();
      return true;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.pos[0] - 18, this.pos[1] - 18, 36, 36);
  }
}

module.exports = Mine;
