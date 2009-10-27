var SpatialMap = function(opts) {
  opts = opts || {};
  this.cellSize = opts.cellSize || 16;

  this.map = {};
};

SpatialMap.prototype.clear = function() {
  this.map = {};
};

SpatialMap.prototype.add = function(point) {
  var x = this.getBase(point.x);
  var y = this.getBase(point.y);

  this.set(x, y, point);
};

SpatialMap.prototype.get = function(x, y) {
  x = this.getBase(x);
  y = this.getBase(y);

  var key = x + "x" + y;

  return this.map[key];
};

SpatialMap.prototype.getAllFromNeighbourhood = function(x, y) {
  var points = [];
  points = points.concat( this.get(x, y) || [] );
  points = points.concat( this.get(x - 16, y - 16) || [] );
  points = points.concat( this.get(x, y - 16) || [] );
  points = points.concat( this.get(x + 16, y - 16) || [] );
  points = points.concat( this.get(x + 16, y) || [] );
  points = points.concat( this.get(x + 16, y + 16) || [] );
  points = points.concat( this.get(x, y + 16) || [] );
  points = points.concat( this.get(x - 16, y - 16) || [] );
  points = points.concat( this.get(x - 16, y) || [] );

  return points;
}

SpatialMap.prototype.set = function(x, y, point) {
  if(arr = this.get(x, y)) {
    arr.push(point);
  } else {
    var key = x + "x" + y;
    this.map[key] = [point];
  }
}

SpatialMap.prototype.getBase = function(a) {
  var sign = a < 0 ? -1 : 1;
  var base = Math.abs(a) - (Math.abs(a) % this.cellSize);
  base = base * sign;

  return base;
}


