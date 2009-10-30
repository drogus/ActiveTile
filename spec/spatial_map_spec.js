Screw.Unit(function() {
  describe("SpatialMap", function() {
    var SpatialMap = activetile.SpatialMap;
    describe("initialization", function() {
      it("should allow to set cell size", function() {
        var map = new SpatialMap({cellSize: 10});
        expect(map.cellSize).to(equal, 10);
      });

      it("should set cellSize to 16 by default", function() {
        var map = new SpatialMap();
        expect(map.cellSize).to(equal, 16);
      });
    });

    describe("manipulating points", function() {
      var map;

      before(function() {
        map = new SpatialMap();
      });

      it("should allow to store point in given cell", function() {
        map.add({x: 10, y: 10});
        var points = map.get(10, 10);
        expect(points.length).to(equal, 1);
        points = map.get(15, 15);
        expect(points.length).to(equal, 1);
        points = map.get(17, 17);
        expect(points).to(equal, null);
      });

      it("should allow to get points from neighbourhood (given cell and all cells around)", function() {
        map.add({x: 10, y: 10});
        map.add({x: 20, y: 20});
        map.add({x: 10, y: 20});
        map.add({x: 50, y: 50});
        var points = map.getAllFromNeighbourhood(20, 20);
        expect(points.length).to(equal, 3);
      });

      it("should allow to clear points", function() {
        map.add({x: 10, y: 10});
        map.clear();
        var points = map.get(10, 10);
        expect(points).to(equal, null);
      });
    });
  });
});

