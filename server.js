var restify = require('restify');

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

var games = {}
function gameByKey(key) {
  if (!games[key]) {
    games[key] = new Game();
  }
  return games[key] || new Game();
}

function startGame(req, res, next) {
  game = gameByKey(req.params.key)
  game.start();
  res.send('game started');
}

function getConfig(req, res, next) {
  game = gameByKey(req.params.key)
  res.send(config);
}

function getStatus(req, res, next) {
  game = gameByKey(req.params.key)
  res.send(game);
}

var server = restify.createServer();
server.get('/game/:key/config/', getConfig);
server.get('/game/:key/start/', startGame);
server.get('/game/:key/status/', getStatus);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

