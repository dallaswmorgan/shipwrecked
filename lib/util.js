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
