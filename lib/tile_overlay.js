// activetile.TileOverlay()
//
// Class for inserting tiles on the map.

var activetile = activetile || {};

activetile.TileOverlay = function(options) {
  this.options = options;
  this.parentTile = options.tile;
  this.onTileLoad = options.onTileLoad || function() {};
  this.onTileLoaded = options.onTileLoaded || function() {};

  if(this.parentTile) {
    this.x = parseInt(this.parentTile.style.left);
    this.y = parseInt(this.parentTile.style.top);
  }
  this.set_map(options.map);

  var self = this;
  google.maps.event.addListener(this, 'ready', function() {
    self.onTileLoad(self);
  });
};

activetile.TileOverlay.prototype = new google.maps.OverlayView();

activetile.TileOverlay.prototype.draw = function() {
  if (!this.ready) {
    this.ready = true;
    google.maps.event.trigger(this, 'ready');
  }
  var me = this;

  // Check if the div has been created.
  var div = this.div_;
  if (!div) {
    div = this.div_ = document.createElement('DIV');
    div.style.position = "absolute";
    div.className = "tileOverlay";
    if(this.options.className)
      div.className += " " + this.options.className;

    img = new Image();
    var self = this;
    img.onload = function() {
      self.loaded = true;
      self.onTileLoaded();
    }
    this.image = img;

    img.src = this.getUrl();
    div.appendChild(img);

    // Then add the overlay to the DOM
    var panes = this.get_panes();
    panes.overlayLayer.appendChild(div);
  }

  // Position the overlay 
//  var point = this.get_projection().fromLatLngToDivPixel(this.latlng_);
  div.style.left = this.x + 'px';
  div.style.top = this.y + 'px';
};

activetile.TileOverlay.prototype.getArgs = function() {

  var projection = this.get_projection();  var north_west = projection.fromDivPixelToLatLng(new google.maps.Point(this.x, this.y));
  var south_east = projection.fromDivPixelToLatLng(new google.maps.Point(this.x + 256, this.y + 256));
  var args = [];
  args.push("area[lat1]=" + north_west.lat());
  args.push("area[lat2]=" + south_east.lat());
  args.push("area[lng1]=" + north_west.lng());
  args.push("area[lng2]=" + south_east.lng());
  args.push("zoom=" + this.map.get_zoom());

  args = args.join("&");

  return args;
};

activetile.TileOverlay.prototype.getUrl = function() {
  var url = this.options.url;
  var args = this.getArgs();

  if(url.match(/\?/)) {
    url += "&" + args;
  } else {
    url += "?" + args;
  }

  return url;
};

activetile.TileOverlay.prototype.remove = function() {
  // Check if the overlay was on the map and needs to be removed.
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

activetile.TileOverlay.prototype.get_position = function() {
 return this.latlng_;
};

activetile.TileOverlay.prototype.getParentTile = function() {
  return this.parentTile;
};
