var restify = require('restify');
var Game = require('./game');

var games = {};
function gameByKey(key) {
  if (!games[key]) {
    games[key] = new Game();
  }
  return games[key];
}

function startGame(req, res, next) {
  gameByKey(req.params.key).start();
  res.send('game started');
}

function getConfig(req, res, next) {
  res.send(gameByKey(req.params.key).config);
}

function getStatus(req, res, next) {
  res.send(gameByKey(req.params.key));
}

function login(req, res, next) {
  var game = gameByKey(req.params.key);
  try {
    player = game.loginPlayer(req.params.playername);
    res.send(player.secret);
  } catch (e) {
    res.send(e.message);
  }
}

function moveDown(req, res, next) {
  var game = gameByKey(req.params.key);
  try {
    game.moveDown(req.params.playername, req.params.secret);
    res.send('ok');
  } catch (e) {
    res.send(e.message);
  }
}

function moveUp(req, res, next) {
  var game = gameByKey(req.params.key);
  try {
    game.moveUp(req.params.playername, req.params.secret);
    res.send('ok');
  } catch (e) {
    res.send(e.message);
  }
}

var server = restify.createServer();
server.get('/game/:key/config/', getConfig);
server.get('/game/:key/start/', startGame);
server.get('/game/:key/status/', getStatus);
server.get('/game/:key/login/:playername/', login);
server.put('/game/:key/up/:playername/:secret', moveUp);
server.put('/game/:key/down/:playername/:secret', moveDown);

server.listen(8001, function() {
  console.log('%s listening at %s', server.name, server.url);
});

