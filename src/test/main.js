'use strict';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var chess = new Chess(0, 0);
var colors = ['#fffde7', '#fff3e0', '#fbe9e7', '#ede7f6', '#e1f5fe', '#e0f7fa'];
var game;
var cnt = 0;

var startTime;
$.getJSON('../level.json', function(data) {
  game = new Game(1, 600, data);
});

function rowColToXY(i) {
  return game.margin + (0.5 + i) * game.spacing;
}

function Game(num, size, enemiesList) {
  this.num = num;
  this.enemies = [];
  this.lineCount = 6;
  this.size = size;
  this.margin = size * 1 / 3;
  this.spacing = size * 1 / 3 / this.lineCount;
  this.enemiesList = enemiesList;
}

Game.prototype.refresh = function() {
  // draw map
  ctx.fillStyle = colors[parseInt(cnt / 8) % 6];
  ctx.fillRect(0, 0, 600, 600);

  ctx.fillStyle = '#f57f17';
  ctx.fillRect(200,200,200,200);

  ctx.strokeStyle = 'white';
  ctx.beginPath();

  var i;
  for (i = 0; i < this.lineCount; i++) {
    var end = 200 + this.spacing * i;
    ctx.moveTo(200, end);
    ctx.lineTo(400, end);
    ctx.moveTo(end, 200);
    ctx.lineTo(end, 400);
    ctx.stroke();
  }
  ctx.closePath();

  // add players
  var x,y;
  for (x = 0;x<this.lineCount;x++) {
    for (y = 0;y<this.lineCount;y++) {
      var p = ChessPosition(x,y);
      if ( p !== 0) {
        (function(p) {
          var player;
          if (p == -1){
            player = new Chess(x,y);
            player.append('#616161');
          }
          else {
            player = new Chess(x,y);
            player.append();
          }
        })(p);
      }
    }
  }
  // end of add
  if (ChessPosition(chess.x,chess.y)== -1){
    chess.append('#616161');
  }
  else {
    chess.append('#ff5252');
  }
  


  for (i = 0; i < this.enemies.length; i++) {
    if (this.enemies[i]) {
      this.enemies[i].append();
    }
  }

  var timeNow = parseInt((new Date().getTime() - startTime) / 1000);
  //ctx.strokeStyle = '#616161';
  ctx.fillStyle = "#bdbdbd";
  ctx.fillRect(520,20,60,30);
  ctx.fillStyle = "white";
  ctx.font="20px sans-serif";
  ctx.fillText(timeNow,540,45);
};

function randGenerator(n, range) {
  var arr = [];
  while(arr.length < n){
    var randomNumber = parseInt(Math.random() * range);
    var found = false;
    for(var i = 0; i < arr.length;i++){
      if(arr[i] === randomNumber) {
        found = true;
        break;
      }
    }
    if(!found)arr[arr.length]=randomNumber;
  }
  return arr;
}

Game.prototype.addNewEnemies = function(n) {
  for (var i = 0; i < this.enemiesList[cnt].directions.length; i++) {
    var direction = parseInt(this.enemiesList[cnt].directions[i] / this.lineCount);
    var position = this.enemiesList[cnt].directions[i] % this.lineCount;
    var x, y;
    switch (direction) {
      case 0:
        x = game.size - 30;
        y = rowColToXY(position);
        break;
      case 1:
        x = rowColToXY(position);
        y = 30;
        break;
      case 2:
        x = 30;
        y = rowColToXY(position);
        break;
      case 3:
        x = rowColToXY(position);
        y = game.size - 30;
    }
    this.enemies.push(new Enemy(x, y, this.enemiesList[cnt].speed, direction));
  }

  cnt++;

  //var cols = randGenerator(n, game.lineCount);
  //var rows = randGenerator(n, game.lineCount);
  //var directions = randGenerator(n, 4);
  //for (var i = 0; i < n + 1; i++) {
  //  var x, y;
  //  switch (directions[i]) {
  //    case 0:
  //      // from right
  //      x = game.size - 30;
  //      y = rowColToXY(rows[i]);
  //      break;
  //    case 1:
  //      // from down
  //      y = 30;
  //      x = rowColToXY(cols[i]);
  //      break;
  //    case 2:
  //      // from left
  //      x = 30;
  //      y = rowColToXY(rows[i]);
  //      break;
  //    case 3:
  //      // from top
  //      y = game.size - 30;
  //      x = rowColToXY(cols[i]);
  //      break;
  //    default:
  //      return;
  //  }
  //  this.enemies.push(new Enemy(x, y, speed, directions[i]));
  //}
};

Game.prototype.enemiesMove = function() {
  var that = this;
  setInterval(function() {
    for (var i = 0; i < that.enemies.length; i++){
      if (!that.enemies[i]) continue;
      if (!that.enemies[i].move()) {
        delete that.enemies[i];
      }
    }
  }, 30);
};


Game.prototype.run = function() {
  $('#background-music')[0].play();
  var that = this;
  startTime = new Date().getTime();
  setInterval(that.refresh.bind(that), 30);
  setInterval(that.addNewEnemies.bind(that, 3), 3000);
  this.enemiesMove();
};


function Chess(x, y) {
  if (x !== undefined && y !== undefined) {
    this.x = x;
    this.y = y;
  } else {
    this.x = parseInt(Math.random() * this.num + 3);
    this.y = parseInt(Math.random() * this.num + 3);
  }
  //init pos
  //ChessPosition(this.x,this.y,_Player.name)
}

Chess.prototype.append = function(color) {
  //var oldColor = ctx.fillStyle;
  var fillStyle = 'white';
  if (color != undefined)
    fillStyle = color;
  ctx.beginPath();
  ctx.arc(200 + game.spacing * (this.x + 0.5), 200 + game.spacing * (this.y + 0.5), game.spacing * 0.35, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.stroke();
  //ctx.fillStyle = oldColor;
};

Chess.prototype.move = function(type) {
  // add remote push
  var moveTo  = function(x,y) {
    if (ChessPosition(x,y) !== 0) return;
    ChessPosition(this.x, this.y, 0);
    this.x = x;
    this.y = y;
    $('#click-music')[0].play();
    ChessPosition(this.x,this.y,_Player.name)
  };
  
    switch(type) {
    case 1:
      // Up
      if (this.y === 0) return;
      moveTo.call(this, this.x, this.y - 1);
      break;
    case 2:
      // Right
      if (this.x === game.lineCount - 1) return;
      moveTo.call(this,this.x+1,this.y);
      break;
    case 3:
      // Down
      if (this.y === game.lineCount - 1) return;
      moveTo.call(this,this.x,this.y+1);
      break;
    case 0:
      // LEFT
      if (this.x === 0) return;
      moveTo.call(this,this.x-1,this.y);
      break;
    default:
      return;
  }
  // end of add 
};

function keyMove(event){
  var key = event.keyCode;
  if (key < 37 || key > 40) return;

  chess.move(key - 37);
}

document.addEventListener('keydown', keyMove);

function Enemy(x, y, speed, direction) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.direction = direction;
}

Enemy.prototype.append = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, game.spacing * 0.35, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.stroke();
};

Enemy.prototype.move = function() {
  switch (this.direction) {
    case 0:
      if (this.x < 20) {
        return false;
      }
      this.x -= this.speed / 50;
      break;
    case 1:
      if (this.y > game.size - 20) {
        return false;
      }
      this.y += this.speed / 50;
      break;
    case 2:
      if (this.x > game.size - 20) {
        return false;
      }
      this.x += this.speed / 50;
      break;
    case 3:
      if (this.y < 20) {
        return false;
      }
      this.y -= this.speed / 50;
      break;
    default:
      return false;
  }
  var deltaX = this.x - rowColToXY(chess.x);
  var deltaY = this.y - rowColToXY(chess.y);
  var radiusSum = game.spacing * 0.7;
  if (deltaX * deltaX + deltaY * deltaY <= radiusSum * radiusSum) {
    $(document).trigger('fail');
  }
  return true;
};

$(document).one('fail', function() {
  $('#collision-music')[0].play();
  document.removeEventListener('keydown', keyMove);
  $("#wrapper").show();
  setState('fail');
  ChessPosition(chess.x,chess.y,-1);
});

$(function() {
  
});
window.updateUserList = function(){
  ChessPosition(chess.x,chess.y,_Player.name)
};