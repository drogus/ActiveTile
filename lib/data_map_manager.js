var activetile = activetile || {};

activetile.DataMapManager = function(options) {
  options = options || {};
  this.data_maps = {};
  this.createFunction = options.createFunction;
};

activetile.DataMapManager.prototype.add = function(name, options) {
  this.data_maps[name] = this.createFunction(name);
};

activetile.DataMapManager.prototype.get = function(name) {
  return this.data_maps[name];
};

activetile.DataMapManager.prototype.remove = function(name) {
  this.data_maps[name] = null;
};


