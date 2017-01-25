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
	  canvasEl.width = 500;
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
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
	    } else if (this.game.isOutOfBoundsX(newPos, this.radius)) {
	      offsetX = 0;
	    } else if (this.game.isOutOfBoundsY(newPos, this.radius)) {
	      offsetY = 0;
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
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir (vec) {
	    const norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },

	  // Scale the length of a vector by the given amount.
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },

	};

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Boat = __webpack_require__(2);


	class Coin extends MovingObject {
	  constructor(options) {
	    options.radius = 200;
	    options.vel = [0, 0];
	    options.color = "yellow";
	    super(options);
	  }

	  collideWith(otherObject) {
	    if (otherObject instanceof Boat) {
	      playSound2();
	      this.remove();
	      this.game.addCoin();
	      return true;
	    }
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
	    options.color = 'black';
	    options.pos = options.pos || options.game.randomPosition();
	    options.radius = 20;
	    options.vel = options.vel || [0, 0];
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
	}

	module.exports = Mine;


/***/ },
/* 7 */
/***/ function(module, exports) {


	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	    this.boat = this.game.addBoat();
	    this.coin = this.game.addCoin();
	    this.game.addMine();
	  }

	  bindKeyHandlers() {
	    const boat = this.boat;

	    Object.keys(GameView.MOVES).forEach((k) => {
	      let move = GameView.MOVES[k];
	      key(k, () => { boat.power(move); });
	    });

	  }

	  start() {
	    this.bindKeyHandlers();
	    this.lastTime = 0;
	    //start the animation
	    requestAnimationFrame(this.animate.bind(this));
	  }

	  animate(time) {
	    const timeDelta = time - this.lastTime;

	    this.game.step(timeDelta);
	    this.game.draw(this.ctx);
	    this.lastTime = time;

	    //every call to animate requests causes another call to animate
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}

	GameView.MOVES = {
	  "up": [ 0, -1],
	  "left": [-1,  0],
	  "down": [ 0,  1],
	  "right": [ 1,  0],
	};

	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
