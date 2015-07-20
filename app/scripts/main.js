'use strict';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var chesses = [];
var chess = new Chess(0, 0);
var game = new Game(1, 600);

function rowColToXY(i) {
  return game.margin + (0.5 + i) * game.spacing;
}

function Game(num, size) {
  this.num = num;
  this.enemies = [];
  this.lineCount = num + 3;
  this.size = size;
  this.margin = size * 1 / 3;
  this.spacing = size * 1 / 3 / this.lineCount;
}

Game.prototype.refresh = function() {
  ctx.fillStyle = '#fff9c4';
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

  chess.append();
  for (i = 0; i < this.enemies.length; i++) {
    if (this.enemies[i]) {
      console.log(i);
      this.enemies[i].append();
    }
  }
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

Game.prototype.addNewEnemies = function(n, speed) {
  var cols = randGenerator(n, game.lineCount);
  var rows = randGenerator(n, game.lineCount);
  var directions = randGenerator(n, 4);
  for (var i = 0; i < n + 1; i++) {
    var x, y;
    switch (directions[i]) {
      case 0:
        // from right
        x = game.size - 30;
        y = rowColToXY(rows[i]);
        break;
      case 1:
        // from down
        y = 30;
        x = rowColToXY(cols[i]);
        break;
      case 2:
        // from left
        x = 30;
        y = rowColToXY(rows[i]);
        break;
      case 3:
        // from top
        y = game.size - 30;
        x = rowColToXY(cols[i]);
        break;
      default:
        return;
    }
    this.enemies.push(new Enemy(x, y, speed, directions[i]));
  }
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
  var that = this;
  setInterval(that.refresh.bind(that), 30);
  setInterval(that.addNewEnemies.bind(that, 3, 300), 3000);
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
}

Chess.prototype.append = function() {
  ctx.beginPath();
  ctx.arc(200 + game.spacing * (this.x + 0.5), 200 + game.spacing * (this.y + 0.5), game.spacing * 0.35, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.stroke();
};

Chess.prototype.move = function(type) {
  switch(type) {
    case 1:
      // Up
      if (this.y === 0) return;
      this.y -= 1;
      break;
    case 2:
      // Right
      if (this.x === game.lineCount - 1) return;
      this.x += 1;
      break;
    case 3:
      // Down
      if (this.y === game.lineCount - 1) return;
      this.y += 1;
      break;
    case 0:
      // LEFT
      if (this.x === 0) return;
      this.x -= 1;
      break;
    default:
      return;
  }
};

document.addEventListener('keydown', function(event) {
  var key = event.keyCode;
  if (key < 37 || key > 40) return;

  chess.move(key - 37);
});

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
  alert('fail');
});

$(function() {
  game.run();
});