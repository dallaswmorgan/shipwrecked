const Boat = require('./boat');
const Coin = require('./coin');
const Mine = require('./mine');
const Util = require('./util');

class Game {
  constructor() {
    this.boats = [];
    this.coins = [];
    this.mines = [];

    this.addBoat();
    this.addCoin();
    this.addMine();
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
    this.add(new Mine({game: this, pos: this.randomPosition()}));
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

  checkCollisions() {

  }
}

module.exports = Game;
