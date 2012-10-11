var restify = require('restify');

var FIELD_HEIGHT = 300;
var FIELD_WIDTH = 300;

var TIME_QUANTUM = 10;
var INITIAL_BALL_SPEED = 1;

function random(value) {
  return Math.random() * value * 2 - value;
}

var game = {
  ball: [0, 0],
  ballDelta: [0, 0],
  paddleLeft: 0,
  paddleRight: 0,
  start: function() {
    this.ball = [FIELD_WIDTH / 2, FIELD_HEIGHT /2];
    this.ballDelta = [random(INITIAL_BALL_SPEED), random(INITIAL_BALL_SPEED)];
    setTimeout(this.run.bind(this), 100);
  },
  run: function() {
    if (this.ball[0] >= FIELD_HEIGHT || this.ball[0] <= 0) {
      this.ballDelta[0] *= -1;
    }
    if (this.ball[1] >= FIELD_HEIGHT || this.ball[1] <= 0) {
      this.ballDelta[1] *= -1;
    }
    this.ball[0] += this.ballDelta[0];
    this.ball[1] += this.ballDelta[1];
    setTimeout(this.run.bind(this), TIME_QUANTUM);
    console.log(this.ball);
  }
};

function startGame(req, res, next) {
  game.start();
  res.send('game started');
}

function status(req, res, next) {
  res.send(game);
}

var server = restify.createServer();
server.get('/game/start/', startGame);
server.get('/game/status/', status);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

