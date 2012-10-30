var config = {
  FIELD_HEIGHT: 300,
  FIELD_WIDTH: 300,

  FIELD_PADDING_X: 10,
  FIELD_PADDING_Y: 10,

  PADDLE_HEIGHT: 70,
  PADDLE_WIDTH: 20,

  TIME_QUANTUM: 10,
  INITIAL_BALL_SPEED: 5
};

function random(value) {
  return Math.random() * value * 2 - value;
}

var Game = function Game(customConfig) {
  this.ball = [config.FIELD_WIDTH / 2, config.FIELD_HEIGHT /2];
  this.ballDelta = [0, 0];
  this.paddleLeft = config.FIELD_HEIGHT / 2;
  this.paddleRight = config.FIELD_HEIGHT / 2;
  this.players = [];
}

Game.prototype.start = function start() {
  this.ball = [config.FIELD_WIDTH / 2, config.FIELD_HEIGHT /2];
  this.ballDelta = [random(config.INITIAL_BALL_SPEED), random(config.INITIAL_BALL_SPEED)];
  setTimeout(this.run.bind(this), 100);
}

Game.prototype.run = function run() {
  if (this.ball[0] >= config.FIELD_WIDTH - config.FIELD_PADDING_X) {
    if (this.ball[1] > this.paddleRight - config.PADDLE_HEIGHT/2 || 
        this.ball[1] < this.paddleRight + config.PADDLE_HEIGHT/2) {
          this.ballDelta[0] *= -1;
        }
  }

  if(this.ball[0] <= config.FIELD_PADDING_X) {
    this.ballDelta[0] *= -1;
  }

  if (this.ball[1] >= config.FIELD_HEIGHT - config.FIELD_PADDING_Y || 
      this.ball[1] <= config.FIELD_PADDING_Y) {
        this.ballDelta[1] *= -1;
      }
  this.ball[0] += this.ballDelta[0];
  this.ball[1] += this.ballDelta[1];
  setTimeout(this.run.bind(this), config.TIME_QUANTUM);
}

Game.prototype.loginPlayer = function loginPlayer(playername) {
  if (this.players.length <=2) {
    player = {
      'name': playername,
      'secret': '123'
    };
    this.players.push(player);
    return player;
  }
}
Game.prototype.config = config

module.exports = Game;
