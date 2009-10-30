var activetile = activetile || {};

activetile.SpatialMap = function(opts) {
  opts = opts || {};
  this.cellSize = opts.cellSize || 16;

  this.map = {};
};

activetile.SpatialMap.prototype.clear = function() {
  delete(this.map);
  this.map = {};
};

activetile.SpatialMap.prototype.add = function(point) {
  var x = this.getBase(point.x);
  var y = this.getBase(point.y);

  this.set(x, y, point);
};

activetile.SpatialMap.prototype.get = function(x, y) {
  x = this.getBase(x);
  y = this.getBase(y);

  var key = x + "x" + y;

  return this.map[key];
};

activetile.SpatialMap.prototype.getAllFromNeighbourhood = function(x, y) {
  var points = [];
  points = points.concat( this.get(x, y) || [] );
  points = points.concat( this.get(x - 16, y - 16) || [] );
  points = points.concat( this.get(x, y - 16) || [] );
  points = points.concat( this.get(x + 16, y - 16) || [] );
  points = points.concat( this.get(x + 16, y) || [] );
  points = points.concat( this.get(x + 16, y + 16) || [] );
  points = points.concat( this.get(x, y + 16) || [] );
  points = points.concat( this.get(x - 16, y + 16) || [] );
  points = points.concat( this.get(x - 16, y) || [] );

  return points;
};

activetile.SpatialMap.prototype.set = function(x, y, point) {
  var arr;
  if(arr = this.get(x, y)) {
    arr.push(point);
  } else {
    var key = x + "x" + y;
    this.map[key] = [point];
  }
};

activetile.SpatialMap.prototype.getBase = function(a) {
  var sign = a < 0 ? -1 : 1;
  var base = Math.abs(a) - (Math.abs(a) % this.cellSize);
  base = base * sign;

  return base;
};
