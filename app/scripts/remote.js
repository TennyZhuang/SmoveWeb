(function() {
  var _ref_url, init, login, resetChess, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  _ref_url = "https://smoveweb.firebaseio.com/";

  /*
  	_UserList 	#idxxx :{name}
  				#idxxx :{name}
   	ChessRef	N --- 1..4
  				0:player
  				(...):
  				N^2-1:player
  		
  player =={0,name1,name2...}
   */

  init = function() {
    root.BaseRef = new Firebase(_ref_url);
    root.UserListRef = BaseRef.child('UserList');
    root.ChessRef = BaseRef.child('Chess');
    root.TimeRef = BaseRef.child('Time');
    root.PlayerRef = UserListRef.push();

    PlayerRef.set({
      name: "",
      state: "online"
    });

    PlayerRef.onDisconnect().remove();
    root._UserList = void 0;
    root._Chess = void 0;
    root._Player = void 0;
    UserListRef.on('value', function(snapshot) {
      var n;
      root._UserList = [];
      snapshot.forEach(function(childSnapshot) {
        _UserList.push(childSnapshot.val());
        return false;
      });
      _updateUserList();
      return n = _UserList.length;
    });
    ChessRef.on('value', function(snapshot) {
      root._Chess = snapshot.val();
      return _updateChess();
    });
    PlayerRef.on('value', function(snapshot) {
      return root._Player = snapshot.val();
    });
    login();
    return resetChess(6);
  };

  login = function() {
    var nameField;
    $('canvas').hide();
    LoginDiv = $('#loginDiv')[0];
    nameField = $('#nameInput');
    nameField.focus();
    nameField.blur(function() {
      return nameField.focus();
    });
    return nameField.keypress(function(e) {
      var name;
      if (e.keyCode === 13) {
        if (!nameField.val().trim()) {
          alert("请输入用户名");
          return;
        }
        gameProcess(0);
        name = nameField.val();
        setName(name);
        setState('ready');
        $("#loginDiv").append($('<p>').append("Hello " + name + " please wait for other players"));
      }
    });
  };

  window.onTimeRun = function(ts, fn) {
    var timeNow;
    timeNow = new Date().getTime();
    return window.setTimeout(fn, ts - timeNow);
  };

  resetChess = function(cols) {
    var j, m, ref1, results, x, y;
    ChessRef.set({
      cols: cols
    });
    results = [];
    for (x = j = 0, ref1 = cols - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
      results.push((function() {
        var k, ref2, results1;
        results1 = [];
        for (y = k = 0, ref2 = cols - 1; 0 <= ref2 ? k <= ref2 : k >= ref2; y = 0 <= ref2 ? ++k : --k) {
          m = x + y * cols;
          results1.push(ChessRef.child(m).set(0));
        }
        return results1;
      })());
    }
    return results;
  };

  window.gameProcess = function(e) {
    if (e === void 0) {
      return window.__gameProcess;
    } else {
      return window.__gameProcess = e;
    }
  };

  window._updateUserList = function() {
    var N, alive, endGame, i, isReady, j, k, len, len1;
    isReady = function() {
      var Ready, i, j, len;
      Ready = true;
      for (j = 0, len = _UserList.length; j < len; j++) {
        i = _UserList[j];
        if (i.state !== 'ready') {
          Ready = false;
        }
      }
      return Ready;
    };
    endGame = function() {
      var overLay;
      overLay = $('<div>').addClass('cover');

      $("#lose").text("Game Over");
      $('#restart').click(function() {
        location.reload();
      })
    };
    if (gameProcess() === 0) {
      if (isReady()) {
        $(loginDiv).remove();
        $('#canvas').show();
        gameProcess(1);
        setState('alive');
        game.run();
      }
    }
    if (gameProcess() === 1) {
      N = _UserList.length;
      if (_UserList > 1) {
        alive = 0;
        for (j = 0, len = _UserList.length; j < len; j++) {
          i = _UserList[j];
          if (i.state === 'alive') {
            alive++;
          }
        }
        if (alive === 1) {
          endGame();
        }
      } else {
        alive = 0;
        for (k = 0, len1 = _UserList.length; k < len1; k++) {
          i = _UserList[k];
          if (i.state === 'alive') {
            alive++;
          }
        }
        if (alive === 0) {
          endGame();
        }
      }
    }
  };

  window._updateChess = function() {};

  window.setName = function(name) {
    if (name === "" || name === void 0) {
      console.error('failed to set name');
      return false;
    } else {
      PlayerRef.update({
        name: name
      });
      return true;
    }
  };

  window.setState = function(state) {
    if (state === "" || state === void 0) {
      console.error('failed to set state');
      return false;
    } else {
      PlayerRef.update({
        state: state
      });
      return true;
    }
  };

  window.setScore = function(score) {
    PlayerRef.update({score: score});
  };

  window.getUserList = function() {
    return _UserList;
  };

  window.getChess = function() {
    return _Chess;
  };

  window.getPlayer = function() {
    return _Player;
  };

  window.getUserRefByName = function(name) {
    return UserListRef.on('value', function(snapshot) {
      var ref;
      ref = null;
      return snapshot.forEach(childSnapshot)(function() {
        if (childSnapshot.name === name) {
          return childSnapshot.ref();
        } else {
          return false;
        }
      });
    });
  };

  window.ChessPosition = function(x, y, set) {
    var n;
    n = x + (_Chess.cols * y);
    if (set === void 0) {
      return _Chess[n];
    } else {
      n = x + (_Chess.cols * y);
      return ChessRef.child(n).set(set);
    }
  };

  window.PlayerState = function(s) {
    if (s === void 0) {
      return CurrentState;
    } else {
      return PlayerRef.update({
        state: s
      });
    }
  };

  init();

}).call(this);
