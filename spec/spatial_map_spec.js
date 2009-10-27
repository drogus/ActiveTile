Screw.Unit(function() {
  describe("SpatialMap", function() {
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
  });
});

