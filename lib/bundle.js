/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(7);
	
	document.addEventListener("DOMContentLoaded", () => {
	  const canvasEl = document.getElementById("canvas");
	  canvasEl.width = 700;
	  canvasEl.height = 500;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Boat = __webpack_require__(2);
	const Coin = __webpack_require__(5);
	const Mine = __webpack_require__(6);
	const Util = __webpack_require__(4);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
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
	    // default do nothing
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
	    //timeDelta is number of milliseconds since last move
	    //if the computer is busy the time delta will be larger
	    //in this case the MovingObject should move farther in this frame
	    //velocity of object is how far it should move in 1/60th of a second
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	
	  dir (ref, target) {
	    const directionVec = [target[0] - ref[0], target[1] - ref[1]];
	    const norm = Util.norm(directionVec);
	    return Util.scale(directionVec, 1 / norm);
	  },
	
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },
	
	  calcVel (dir, speed) {
	    return [dir[0] * speed, dir[1] * speed];
	  },
	
	
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	  speed (vel) {
	    return Math.sqrt(
	      Math.pow(vel[0], 2) + Math.pow(vel[0], 2)
	    );
	  },
	
	  rotate (dir, rad) {
	    const dirX = (dir[0] * Math.cos(rad) - (dir[1] * Math.sin(rad)));
	    const dirY = (dir[1] * Math.cos(rad) + (dir[0] * Math.sin(rad)));
	    return[dirX, dirY];
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Boat = __webpack_require__(2);
	
	
	class Coin extends MovingObject {
	  constructor(options) {
	    options.radius = 15;
	    options.vel = [0, 0];
	    options.color = "yellow";
	    options.img = document.getElementById('coin');
	    super(options);
	  }
	
	  collideWith(otherObject) {
	    if (otherObject instanceof Boat) {
	      playSound2();
	      this.remove();
	      this.game.increaseScore(5);
	      this.game.addCoin();
	      this.game.addMine();
	      return true;
	    }
	  }
	
	  draw(ctx) {
	    ctx.drawImage(this.img, this.pos[0] - 15, this.pos[1] - 15, 30, 30);
	  }
	}
	
	module.exports = Coin;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const MovingObject = __webpack_require__(3);
	const Boat = __webpack_require__(2);
	const Coin = __webpack_require__(5);
	
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	class GameView {
	  constructor(game, ctx, highScore = 0) {
	    this.ctx = ctx;
	    this.game = game;
	    this.game.ctx = ctx;
	    this.boat = this.game.boat;
	    this.coin = this.game.addCoin();
	    this.paused = false;
	    this.highScore = highScore;
	    document.addEventListener('keydown', e => {
	
	      if (e.code === "Space") {
	        let message = document.getElementById('showing');
	        if (message) {
	          message.id = "hidden";
	          this.game = new Game();
	          // this.coin = this.game.addCoin();
	          this.boat = this.game.boat;
	          const newGame = new GameView(this.game, this.ctx, this.highScore);
	          newGame.start();
	        }
	      } else if (e.code === "up" || "down" || "left" || "right") {
	        e.preventDefault();
	      }
	    });
	  }
	
	  bindKeyHandlers() {
	    const boat = this.boat;
	
	    Object.keys(GameView.MOVES).forEach((k) => {
	      let move = GameView.MOVES[k];
	      key(k, () => { boat.power(move); });
	    });
	  }
	
	
	
	  renderScore() {
	    if (this.game.score > this.highScore) {
	      this.highScore = this.game.score;
	    }
	    document.getElementById('score').innerHTML = this.game.score;
	    document.getElementById('high-score').innerHTML = this.highScore;
	  }
	
	  start() {
	    this.bindKeyHandlers();
	    this.lastTime = 0;
	    //start the animation
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animateLoss() {
	  }
	
	  animate(time) {
	    const timeDelta = time - this.lastTime;
	
	    if (this.game.lost()) {
	      this.animateLoss();
	    } else {
	      this.boat.dampen();
	      this.game.step(timeDelta);
	      this.game.draw(this.ctx);
	      this.lastTime = time;
	      this.renderScore();
	    }
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}
	
	GameView.MOVES = {
	  "up": [ 0, -1],
	  "left": [-1,  0],
	  "down": [ 0,  1],
	  "right": [ 1,  0],
	  "w": [ 0, -1],
	  "a": [-1,  0],
	  "s": [ 0,  1],
	  "d": [ 1,  0],
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map