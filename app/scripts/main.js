'use strict';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var chess = new MyChess(0, 0);
var enemies = [];
var game = new Game(1, 600);

function rowColToXY(i) {
  return game.margin + (0.5 + i) * game.spacing;
}

function Game(num, size) {
  this.num = num;
  this.lineCount = num + 3;
  this.size = size;
  this.margin = size * 1 / 3;
  this.spacing = size * 1 / 3 / this.lineCount;
}

game.refresh = function() {
  ctx.fillStyle = "#fff9c4";
  ctx.fillRect(0, 0, 600, 600);

  ctx.fillStyle = "#f57f17";
  ctx.fillRect(200,200,200,200);

  ctx.strokeStyle = 'white';
  ctx.beginPath();
  var i;
  for (i = 0; i < game.lineCount; i++) {
    var end = 200 + game.spacing * i;
    ctx.moveTo(200, end);
    ctx.lineTo(400, end);
    ctx.moveTo(end, 200);
    ctx.lineTo(end, 400);
    ctx.stroke();
  }

  ctx.closePath();

  chess.append();

  for (i = 0; i < enemies.length; i++) {
    enemies[i].append();
  }
};

game.addNewEnemies = function(enemy) {
  enemies.push(enemy);
};

game.enemiesMove = function() {
  setInterval(function() {
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].move();
    }
  }, 30);
};


function MyChess(x, y) {
  if (x !== undefined && y !== undefined) {
    this.x = x;
    this.y = y;
  } else {
    this.x = parseInt(Math.random() * this.num + 3);
    this.y = parseInt(Math.random() * this.num + 3);
  }
}

MyChess.prototype.append = function() {
  ctx.beginPath();
  ctx.arc(200 + game.spacing * (this.x + 0.5), 200 + game.spacing * (this.y + 0.5), game.spacing * 0.35, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
};

//MyChess.prototype.remove = function() {
//  ctx.fillStyle = "#f57f17";
//  ctx.fillRect(201 + game.spacing * this.x, 201 + game.spacing * this.y, game.spacing - 2, game.spacing - 2);
//};

MyChess.prototype.move = function(type) {
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
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
};

Enemy.prototype.move = function() {
  switch (this.direction) {
    case 0:
      this.x -= this.speed / 50;
      break;
    case 1:
      this.y += this.speed / 50;
      break;
    case 2:
      this.x += this.speed / 50;
      break;
    case 3:
      this.y -= this.speed / 50;
      break;
    default:
      return;
  }
  var deltaX = this.x - rowColToXY(chess.x);
  var deltaY = this.y - rowColToXY(chess.y);
  var radiusSum = game.spacing * 0.7;
  if (deltaX * deltaX + deltaY * deltaY <= radiusSum * radiusSum) {
    $(document).trigger("fail");
  }
};

$(document).one("fail", function() {
  alert("fail");
});

$(function() {
  setInterval(game.refresh, 30);
  game.addNewEnemies(new Enemy(200 + game.spacing / 2, game.spacing / 2, 200, 1));
  game.enemiesMove();
});