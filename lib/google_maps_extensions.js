/**
 * In V3 it is quite hard to gain access to Projection and Panes.
 * This is a helper class
 * @param {google.maps.Map} map
 */
function ProjectionHelperOverlay(map) {
  google.maps.OverlayView.call(this);
  this.set_map(map);
}
ProjectionHelperOverlay.prototype = new google.maps.OverlayView();
ProjectionHelperOverlay.prototype.draw = function () {
  if (!this.ready) {
    this.ready = true;
    google.maps.event.trigger(this, 'ready');
  }
};

google.maps.Map.prototype.getTiles = function() {
  var container = this.getPanesContainer();
  for(var i = 0; i < container.childNodes.length; i++) {
    if(!container.childNodes[i].id.match(/^pane_/)) {
      return container.childNodes[i].childNodes[0].childNodes;
    }
  }
  return [];
}

google.maps.Map.prototype.isTileVisible = function(tile) {
  var container = this.getPanesContainer();

  var tile_top = parseInt(tile.style.top);
  var tile_left = parseInt(tile.style.left);

  var container_top, container_left, transform;
  if(transform = container.style.MozTransform || container.style.webkitTransform) {
    var xy = /\(.*\)/.exec(transform)[0].slice(1, -1).split(", ").slice(-2);
    container_top = parseInt(xy[1]);
    container_left = parseInt(xy[0]);
  } else {
    container_top = parseInt(container.style.top);
    container_left = parseInt(container.style.left);
  }

  tile_top = tile_top + container_top;
  tile_left = tile_left + container_left;
  var tile_bottom = tile_top + 256; //tile.firstElementChild.offsetHeight;
  var tile_right = tile_left + 256; //tile.firstElementChild.offsetWidth;

  //main map container to get width and height
  var parent = container.parentNode;

  return ( ( tile_top > 0 && tile_top < parent.offsetHeight ) ||
           ( tile_bottom > 0 && tile_bottom < parent.offsetHeight ) ) && 
         ( ( tile_left > 0 && tile_left < parent.offsetWidth) ||
           ( tile_right > 0 && tile_right < parent.offsetWidth) );
}

google.maps.Map.prototype.getPanesContainer = function() {
  return this.getDiv().childNodes[0].childNodes[0];
}

google.maps.Map.prototype.getVisibleTiles = function() {
  var tiles = this.getTiles();
  var visible_tiles = []
  for(var i = 0; i < tiles.length; i++) {
    if(this.isTileVisible(tiles[i])) 
      visible_tiles.push(tiles[i]);
  }

  return visible_tiles;
}

