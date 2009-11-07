//  activetile.ActivityLayer is a class that will keep points visible on tiles
//  and provide interaction with them
//
//  Point is any object that responds to x and y
//

var activetile = activetile || {};

activetile.ActivityLayer = function(opts) {
  opts = opts || {};
  this.points = [];
  this.map = opts.map;
  this.pointRadius = 5;
  this.mouseOverPoint = opts.mouseOverPoint || function() {};
  this.mouseBeyondPoint = opts.mouseBeyondPoint || function() {};

  this.registerEvents();

  this.spatialMap = new activetile.SpatialMap(opts.cellSize || 16);
};

activetile.ActivityLayer.prototype.pointOnCursor = function(x, y, point) {
  var r = this.pointRadius;
  return x < point.x + r && x > point.x - r && y < point.y + r && y > point.y - r;
}

activetile.ActivityLayer.prototype.clearPoints = function() {
  this.points = [];
  this.spatialMap.clear();
};

activetile.ActivityLayer.prototype.onPoint = function(x, y) {
  var points = this.spatialMap.getAllFromNeighbourhood(x, y);

  if(points) {
    for(var i = 0; i < points.length; i++) {
      if(this.pointOnCursor(x, y, points[i])) {
        return points[i];
      }
    }
  }

  return false;
};

activetile.ActivityLayer.prototype.registerEvents = function() {
  var self = this;
  google.maps.event.addListener(this.map, "tilesloaded", function() {
    if(self.eventsRegistered) 
      return;

    self.activeElement = this.getPanesContainer();
    self.onMouseMove = function(event) {
      var x = event.pageX;
      var y = event.pageY;
      
      var top, left;
      if(transform = this.style.MozTransform || this.style.webkitTransform) {
        var xy = /\(.*\)/.exec(transform)[0].slice(1, -1).split(", ").slice(-2);
        top = parseInt(xy[1]);
        left = parseInt(xy[0]);
      } else {
        top =  parseInt(this.style.top);
        left = parseInt(this.style.left);
      }

      x -= left;
      y -= top;

      if(self.map.getDiv()) {
        // must subtract margin and padding of map (only if map is available)
        x -= self.map.getDiv().offsetLeft;
        y -= self.map.getDiv().offsetTop;
      }

      var point;
      if(point = self.onPoint(x, y)) {
        self.activeElement.style.cursor = 'pointer';
        var center = new google.maps.Point(point.x + left, point.y + top);
        self.mouseOverPoint(self, point, center);
      } else {
        self.activeElement.style.cursor = 'auto';
        self.mouseBeyondPoint(self);
      }
    }

    self.activeElement.addEventListener("mousemove", self.onMouseMove, false);
    self.eventsRegistered = true;
  });
};

activetile.ActivityLayer.prototype.addPoint = function(point, tile) {
  if(tile) {
    // point is given with tile we should transform its coords
    point.x += tile.x;
    point.y += tile.y;
  }

  this.points.push(point);
  this.spatialMap.add(point);
};


