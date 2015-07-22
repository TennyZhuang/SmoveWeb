// Generated by CoffeeScript 1.9.3
(function() {
  describe('Import Files', function() {
    it('import main.js', function() {
      return assert.isFunction(Game, 'gameProcess');
    });
    return it('import remote.js', function() {
      return assert.isFunction(onTimeRun, 'onTimeRun');
    });
  });

  describe('firebase', function() {
    it('Is instanceof firebase', function() {
      expect(BaseRef).to.be.an["instanceof"](Firebase);
      expect(ChessRef).to.be.an["instanceof"](Firebase);
      expect(TimeRef).to.be.an["instanceof"](Firebase);
      expect(UserListRef).to.be.an["instanceof"](Firebase);
      return expect(PlayerRef).to.be.an["instanceof"](Firebase);
    });
    it('Global vars defination: this will pass', function() {
      assert.isDefined(_Player);
      return assert.isDefined(_Chess);
    });
    return describe('APIs', function() {
      it('Get Chess Position', function() {
        var a;
        a = ChessPosition(5, 5);
        return expect(a).to.equal(0);
      });
      it('Set Chess Position', function() {
        var b;
        ChessPosition(3, 3, 'val');
        b = ChessPosition(3, 3);
        return expect(b).to.equal('val');
      });
      it('Get player state', function() {
        var state;
        state = _Player.state;
        return assert((state === 'online' || state === 'ready' || state === 'alive' || state === 'fail'));
      });
      it('Set Player state', function() {
        var state;
        setState('ready');
        state = _Player.state;
        return expect(state).to.equal('ready');
      });
      return it('Set Player name', function() {
        var name;
        setName('var');
        name = _Player.name;
        return expect(name).to.equal('var');
      });
    });
  });

}).call(this);