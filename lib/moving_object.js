const Util = require("./util");

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.img = options.img;
  }

  collideWith(otherObject) {
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }

  move(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
    let offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    let newPos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    if (this.game.isOutOfBoundsX(newPos, this.radius) &&
        this.game.isOutOfBoundsY(newPos, this.radius)) {
      offsetX = 0;
      offsetY = 0;
      this.vel = [0,0];
    } else if (this.game.isOutOfBoundsX(newPos, this.radius)) {
      offsetX = 0;
      this.vel= [0,this.vel[1]];
    } else if (this.game.isOutOfBoundsY(newPos, this.radius)) {
      offsetY = 0;
      this.vel = [this.vel[0], 0];
    }
    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  }

  remove() {
    this.game.remove(this);
  }
}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;
