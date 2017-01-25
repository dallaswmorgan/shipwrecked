const Boat = require('./boat');
const Coin = require('./coin');
const Mine = require('./mine');
const Util = require('./util');

class Game {
  constructor() {
    this.boats = [];
    this.coins = [];
    this.mines = [];
  }

  add(object) {
    if (object instanceof Boat) {
      this.boats.push(object);
    } else if (object instanceof Coin) {
      this.coins.push(object);
    } else if (object instanceof Mine) {
      this.mines.push(object);
    }
  }

  randomPosition() {
    return [
      500 * Math.random(),
      500 * Math.random()
    ];
  }

  addMine() {
    this.add(new Mine({ game: this }));
  }

  addBoat() {
    const boat = new Boat({
      game: this
    });

    this.add(boat);
    return boat;
  }

  addCoin() {
    this.add(new Coin({game: this, pos: this.randomPosition()}));
  }

  allObjects() {
    return [].concat(this.boats, this.coins, this.mines);
  }

  draw(ctx) {
  ctx.clearRect(0, 0, 500, 500);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, 500, 500);

  this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
  }

  isOutOfBoundsX(pos, radius) {
    return pos[0] < 0 + radius || pos[0] > 500 - radius;
  }

  isOutOfBoundsY(pos, radius) {
    return pos[1] < 0 + radius || pos[1] > 500 - radius;
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  remove(object) {
    if (object instanceof Coin) {
      this.coins.splice(this.coins.indexOf(object), 1);
    } else if (object instanceof Mine) {
      this.mines.splice(this.mines.indexOf(object), 1);
    } else if (object instanceof Boat) {
      this.boats.splice(this.boats.indexOf(object), 1);
    }
  }


  checkCollisions() {
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];
        if (obj1 !== obj2 && obj1.isCollidedWith(obj2)) {
          const collision = obj1.collideWith(obj2);
          if (collision) return;
        }
      }
    }
  }
}

module.exports = Game;
