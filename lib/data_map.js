// DataMap - tiles with data that can be added to google map
// 
// Params:
// * hash:
//   * map - instance of Map
//   * tilesUrl - url of tile that will be converted to tile with bounds, ie:
//                url?lat1=...&lat2=...&lng1=...&lng2=...&zoom=...
//
//                Default: /tiles
//
//   * onTileLoad - function that will be called after each tile load

var activetile = activetile || {};

activetile.DataMap = function(options) {
  var self = this;
  // load defaults
  options = options || {};
  this.tilesUrl = options.tilesUrl || "/tiles";
  this.onTileLoad = options.onTileLoad || function() {};
  this.onTilesReload = options.onTilesReload || function() {};
  this.onTilesRemove = options.onTilesRemove || function() {};
  this.map = options.map;
  this.loadQueue = [];
  this.concurrentLoads = options.concurrentLoads || 0;

  // allow user to add requests which can be stopped after removeTiles()
  this.requests = [];

  this.tiles = [];
  this.tilesLoaders = []

  this.projectionHelper = new ProjectionHelperOverlay(this.map);
  event.addListener(this.projectionHelper, 'ready', function(){
      self.projection = this.get_projection();
  });
}

activetile.DataMap.prototype.showTiles = function() {
  var self = this;
  this.tilesLoaders.push(event.addListener(this.map, "tilesloaded", function() { self.updateTiles(); }));
  this.tilesLoaders.push(event.addListener(this.map, "dragend", function() { self.updateTiles(); }));
  this.tilesLoaders.push(event.addListener(this.map, "zoom_changed", function() {self.zoomChanged(); }));
  this.updateTiles();
}

activetile.DataMap.prototype.zoomChanged = function() {
  this.onTilesReload();
  this.removeTiles();
  this.updateTiles();
}

activetile.DataMap.prototype.isTileLoaded = function(tileDiv) {
  for(var i = 0; i < this.tiles.length; i++) {
    if(tileDiv == this.tiles[i].getParentTile())
      return true;
  }
  return false;
}

activetile.DataMap.prototype.loadingTiles = function() {
  var loadingTiles = []
  for(var i = 0; i < this.tiles.length; i++) {
    if(!this.tiles[i].loaded) {
      loadingTiles.push(this.tiles[i]);
    }
  }
  return loadingTiles;
}

activetile.DataMap.prototype.process = function() {
  var length = this.loadingTiles().length;
  var toLoad;
  if(this.concurrentLoads == 0) {
    toLoad = 10000;
  } else {
    toLoad = this.concurrentLoads - length;
  }

  while(toLoad > 0 && this.loadQueue.length > 0) {
    var opts = this.loadQueue.shift();
    if(opts) {
      var tile = new TileOverlay(opts);
      tile.set_map(this.map);
      this.tiles.push(tile);
    }
    toLoad -= 1;
  }
}

activetile.DataMap.prototype.isTileEnqueued = function(tile) {
  for(var i = 0; i < this.loadQueue.length; i++) {
    if(this.loadQueue[i].tile == tile) {
      return true;
    }
  }
  return false;
}

activetile.DataMap.prototype.queue = function(opts) {
  if(!this.isTileLoaded(opts.tile) && !this.isTileEnqueued(opts.tile)) {
    this.loadQueue.push(opts);
  }
  this.process();
};

activetile.DataMap.prototype.updateTiles = function(opts) {
  opts = opts || {};
  var tiles = this.map.getVisibleTiles();

  var self = this;
  for(var i = 0; i < tiles.length; i++) {
    if(!this.isTileLoaded(tiles[i])) {
      this.queue({
        tile: tiles[i], 
        url: this.tilesUrl, 
        onTileLoad: this.onTileLoad, 
        onTileLoaded: function() { self.process(); }
      });
    }
  }
}

activetile.DataMap.prototype.hideTiles = function() {
  if(this.tilesLoaders) {
    for(var i = 0; i < this.tilesLoaders.length; i++) {
      event.removeListener(this.tilesLoaders[i]);
    }
  }
  this.removeTiles();
}

activetile.DataMap.prototype.removeTiles = function() {
  for(var i = 0; i < this.tiles.length; i++) {
    var tile = this.tiles[i];
    tile.set_map(null);
  }
  this.tiles = [];
  this.onTilesRemove();
  this.abortRequests();
}

activetile.DataMap.prototype.abortRequests = function() {
  for(var i = 0; i < this.requests.length; i++) {
    this.requests[i].abort();
  }
  this.requests = [];
}


