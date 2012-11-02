var expect = require('chai').expect;
var Game = require('./game');


describe('Game', function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });
 
  it('should create a Game object', function() {
    expect(game).to.be.object;
  });

  it('should be able to log in', function() {
    expect(game).to.respondTo('loginPlayer');
    var playername = 'foo';
    var player = game.loginPlayer(playername);
    expect(player).to.be.a('object');
    expect(player).to.have.property('name');
    expect(player).to.have.property('secret');
    expect(player.secret).to.be.a('string').with.length.above(2);
    expect(game).to.have.property('players');
    expect(game.players).to.have.property('left');
    expect(game.players.left).to.have.property('name');
    expect(game.players.left.name).to.equal(playername);
  });

  it('should only allow 2 players to log in', function() {
    expect(game.loginPlayer('one')).to.be.ok; 
    expect(game.loginPlayer('two')).to.be.ok; 
    expect(function() {
      game.loginPlayer('three');
    }).to.throw.error;
  });

  it('should start the game, if two players log in', function(done) {
    game.config.WAIT_BEFORE_START = 10;
    expect(game).to.have.property('status');
    expect(game.status).to.equal('login');
    game.loginPlayer('left');
    game.loginPlayer('right');
    expect(game.status).to.equal('ready');
    setTimeout(function() {
      expect(game.status).to.equal('started');
      done();
    }, 10);
  });

  it('should move the ball when game runs', function(done) {
    game.config.WAIT_BEFORE_START = 0;
    game.config.TIME_QUANTUM = 0;
    var pos = game.ball;
    game.loginPlayer('left');
    game.loginPlayer('right');
    setTimeout(function() {
      expect(game.ball[0]).to.not.equal(pos[0]);
      done();
    }, 10);
  });
});
