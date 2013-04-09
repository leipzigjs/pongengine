var fs = require('fs');
var restify = require('restify');
var jade = require('jade');

var Game = require('./game');

var SERVER_PORT = 8001;

var template = fs.readFileSync(__dirname + '/index.jade', 'UTF-8');
var indexTemplate = jade.compile(template);

var games = {};
function gameByKey(key) {
  if (!games[key]) {
    games[key] = new Game();
  }
  return games[key];
}

(function removeFinishedGames() {
  for (var i = 0; i < games.length; i++) {
    if (game.status && game.status === 'finished') {
      game.splice(i, 1);
    }
  }
  setTimeout(removeFinishedGames, 1000);
})();

function startGame(req, res, next) {
  gameByKey(req.params.key).start();
  res.send('game started');
}

function getConfig(req, res, next) {
  res.send(gameByKey(req.params.key).config);
}

function getStatus(req, res, next) {
  res.send(gameByKey(req.params.key).getStatus());
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

function renderSpectatorHtml(req, res, next) {
  res.contentType = 'text/html';
  res.send(indexTemplate({
    port: SERVER_PORT,
    game: req.params.key,
  }));
}

var server = restify.createServer({ 
  formatters: {'text/html': function formatHtml(req, res, body) {
      return '' + body;
  }}
});

server.get('/game/:key/config', getConfig);
server.get('/game/:key', renderSpectatorHtml);
server.post('/game/:key/start', startGame);
server.get('/game/:key/status', getStatus);
server.put('/game/:key/player/:playername', login);
server.post('/game/:key/player/:playername/:secret/up', moveUp);
server.post('/game/:key/player/:playername/:secret/down', moveDown);

server.listen(SERVER_PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});

