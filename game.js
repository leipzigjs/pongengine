var config = {
  FIELD_HEIGHT: 300,
  FIELD_WIDTH: 300,

  BALL_RADIUS: 10,

  PADDLE_HEIGHT: 70,
  PADDLE_WIDTH: 20,
  PADDLE_STEP: 20,
  ACCELORATOR: 10,

  TIME_QUANTUM: 10,
  INITIAL_BALL_SPEED: 2,
  WAIT_BEFORE_START: 1000,
};

var STATUS_LOGIN = 'login';
var STATUS_READY = 'ready';
var STATUS_STARTED = 'started';
var STATUS_FINISHED = 'finshed';

function random(value) {
  var direction = Math.random() < 0.5 ? -1 : 1;
  return direction * (Math.random() * value / 2 + value / 2);
}

// thanks stack overflow
// see http://stackoverflow.com/questions/1349404
function createSecret(length) {
    length = length || 5;
    var secret = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(var i = 0; i < length; i++) {
        secret += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return secret;
}

var Game = function Game(customConfig) {
  this.ball = [config.FIELD_WIDTH / 2, config.FIELD_HEIGHT /2];
  this.ballDelta = [0, 0];
  this.paddleLeft = config.FIELD_HEIGHT / 2;
  this.paddleRight = config.FIELD_HEIGHT / 2;
  this.players = {'left': null, 'right': null};
  this.status = STATUS_LOGIN;
  this.autoStart = true;
};

Game.prototype.start = function start() {
  this.status = STATUS_STARTED;
  this.ball = [config.FIELD_WIDTH / 2, config.FIELD_HEIGHT /2];
  this.ballDelta = [random(config.INITIAL_BALL_SPEED), random(config.INITIAL_BALL_SPEED)];
  this.run();
  return this;
};


Game.prototype.step = function step() {
  if (this.ball[0] >= config.FIELD_WIDTH - config.BALL_RADIUS - config.PADDLE_WIDTH) {
    if (this.ball[1] > this.paddleRight - config.PADDLE_HEIGHT/2 &&
        this.ball[1] < this.paddleRight + config.PADDLE_HEIGHT/2) {
          this.ballDelta[0] *= -1;
          this.ballDelta[1] += (this.ball[1] - this.paddleRight) / config.ACCELORATOR;
    }
  }
  if (this.ball[0] <= config.BALL_RADIUS + config.PADDLE_WIDTH) {
    if (this.ball[1] > this.paddleLeft - config.PADDLE_HEIGHT/2 &&
        this.ball[1] < this.paddleLeft + config.PADDLE_HEIGHT/2) {
          this.ballDelta[0] *= -1;
          this.ballDelta[1] += (this.ball[1] - this.paddleLeft) / config.ACCELORATOR;
    }
  }

  if (this.ball[1] >= config.FIELD_HEIGHT - config.BALL_RADIUS || 
      this.ball[1] <= config.BALL_RADIUS) {
        this.ballDelta[1] *= -1;
      }
  this.ball[0] += this.ballDelta[0];
  this.ball[1] += this.ballDelta[1];
  return this;
}

Game.prototype.run = function run() {
  this.step();
  setTimeout(this.run.bind(this), config.TIME_QUANTUM);
  return this;
};

Game.prototype.loginPlayer = function loginPlayer(playername) {
  if (this.players.right) {
    throw Error('game full');
  }
  var player = {
    'name': playername,
    'secret': createSecret()
  };
  if (this.players.left) {
    this.players.right = player;
    if (this.autoStart) {
      this.status = STATUS_READY;
      setTimeout(this.start.bind(this), config.WAIT_BEFORE_START);
    }
  } else {
    this.players.left = player;
  }
  return player;
};

Game.prototype.moveDown = function moveDown(playername, secret) {
  this.move(playername, secret, config.PADDLE_STEP);
};

Game.prototype.moveUp = function moveUp(playername, secret) {
  this.move(playername, secret, -config.PADDLE_STEP);
};

Game.prototype.move = function move(playername, secret, distance) {
  if (this.players.left.name === playername && 
      this.players.left.secret === secret) {
        this.paddleLeft += distance;
        return;
      }
  if (this.players.right.name === playername &&
      this.players.right.secret === secret) {
        this.paddleRight += distance;
        return;
      }
  throw Error('not your game');
};

Game.prototype.config = config;

module.exports = Game;
