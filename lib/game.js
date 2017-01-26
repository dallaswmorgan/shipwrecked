const Boat = require('./boat');
const Coin = require('./coin');
const Mine = require('./mine');
const Util = require('./util');

class Game {
  constructor() {
    this.explosionImg = document.getElementById('explosion-1');
    this.backgroundImg = document.getElementById('ocean');
    this.lossImg = document.getElementById('loss-message');
    this.boat = new Boat({
      game: this
    });
    this.coins = [];
    this.mines = [];
    this.score = 0;
  }

  add(object) {
    if (object instanceof Boat) {
      this.boat = object;
    } else if (object instanceof Coin) {
      this.coins.push(object);
    } else if (object instanceof Mine) {
      this.mines.push(object);
    }
  }

  lost() {
    return Boolean(!this.boat);
  }

  increaseScore(num) {
    this.score += num;
  }

  randomPosition() {
    // Keeps coins and mines from appareaing against wall
    let pos = [
      (675 * Math.random()) + 25,
      (475 * Math.random()) + 25
    ];
    if (Util.dist(pos, this.boat.pos) < 100) {
      pos = this.randomPosition();
    }
    return pos;
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
    return [].concat(this.boat, this.coins, this.mines);
  }

  draw(ctx) {
  ctx.drawImage(this.backgroundImg, 0, 0, 700, 1500);

  this.allObjects().forEach((object) => {
      if (object !== null) {
        object.draw(ctx);
      }
    });
  }

  alertLoss() {
    console.log(`You scored ${this.score} points. Better luck next time!`);
    let message = document.getElementById('hidden');
    message.id = "showing";
    // this.ctx.draw(this.lossImg, 350,350);
  }

  drawExplosion(ctx, pos, i=0) {
    const explosionFrames = [this.explosionImg, document.getElementById('explosion-2')];
    if (!explosionFrames[i]) return;
    ctx.drawImage(explosionFrames[i], pos[0] - 18, pos[1] - 18, 36, 36);
    this.drawExplosion(ctx, pos, i+ 1);
  }

  moveObjects(delta) {
    const allObjects = this.allObjects();
    this.allObjects().forEach((object) => {

      object.move(delta);
    });
    this.mines.forEach((mine) => {
      mine.chase(this.boat.pos);
    });
  }

  isOutOfBoundsX(pos, radius) {
    return pos[0] < 0 + radius || pos[0] > 703 - radius;
  }

  isOutOfBoundsY(pos, radius) {
    return pos[1] < 5 + radius || pos[1] > 500 - radius;
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
      this.alertLoss();
      this.boat = null;
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
