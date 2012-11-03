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
    }).to.throw(Error);
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

  describe('Paddle', function() {
    it('should move, but only by player with secret', function () {
      var playerLeft = game.loginPlayer('left');
      var playerRight = game.loginPlayer('right');
      var posLeft = game.paddleLeft;
      var posRight = game.paddleLeft;
      game.moveDown(playerLeft.name, playerLeft.secret);
      expect(game.paddleLeft).to.be.above(posLeft);
      game.moveUp(playerRight.name, playerRight.secret);
      expect(game.paddleRight).to.be.below(posRight);
      expect(function movePaddleWithWrongSecrect() {
        game.moveUp(player.name, 'x');
      }).to.throw(Error);
    });

    it('should can be moved only defined times in configured number of steps', function() {
      game.config.NUMBER_OF_PADDLE_MOVES = 2;
      game.config.NUMBER_OF_STEPS = 1;
      var playerLeft = game.loginPlayer('left');
      game.moveDown(playerLeft.name, playerLeft.secret);
      game.moveDown(playerLeft.name, playerLeft.secret);
      expect(function movePaddleToMuch() {
        game.moveDown(playerLeft.name, playerLeft.secret);
      }).to.throw(Error);
      game.step();
      expect(function() {
        game.moveDown(playerLeft.name, playerLeft.secret);
      }).to.not.throw(Error);
    });
  });

  describe('Ball', function() {
    it('should move when game runs', function(done) {
      game.config.WAIT_BEFORE_START = 0;
      game.config.TIME_QUANTUM = 1;
      var pos = game.ball;
      game.loginPlayer('left');
      game.loginPlayer('right');
      setTimeout(function() {
        expect(game.ball[0]).to.not.equal(pos[0]);
        done();
      }, 10);
    });

    it('should be reflected on top of the field', function() {
      game.ballDelta = [0, -1];
      var y = game.config.BALL_RADIUS;
      game.ball = [100, y];
      game.step();
      expect(game.ballDelta).to.be.eql([0, 1]);
      expect(game.ball[1]).to.be.above(y);
    });

    it('should be reflected on bottom of the field', function() {
      game.ballDelta = [0, 1];
      var y = game.config.FIELD_HEIGHT - game.config.BALL_RADIUS;
      game.ball = [100, y];
      game.step();
      expect(game.ballDelta).to.be.eql([0, -1]);
      expect(game.ball[1]).to.be.below(y);
    });

    it('should be reflected on left paddle', function() {
      game.ballDelta = [-1, 0];
      game.paddleLeft = 100;
      var x = game.config.BALL_RADIUS + game.config.PADDLE_WIDTH;
      game.ball = [x, 100];
      game.step();
      expect(game.ballDelta).to.be.eql([1, 0]);
      expect(game.ball[0]).to.be.above(x);
    });

    it('should not be reflected if left paddle is not in position', function() {
      game.ballDelta = [-1, 0];
      game.paddleLeft = 0;
      var x = game.config.BALL_RADIUS + game.config.PADDLE_WIDTH;
      game.ball = [x, 100];
      game.step();
      expect(game.ballDelta).to.be.eql([-1, 0]);
      expect(game.ball[0]).to.be.below(x);
    });

    it('should be reflected on right paddle', function() {
      game.ballDelta = [1, 0];
      game.paddleRight = 100;
      var x = game.config.FIELD_WIDTH - game.config.BALL_RADIUS -
              game.config.PADDLE_WIDTH;
      game.ball = [x, 100];
      game.step();
      expect(game.ballDelta).to.be.eql([-1, 0]);
      expect(game.ball[0]).to.be.below(x);
    });

    it('should not be reflected if right paddle is not in position', function() {
      game.ballDelta = [1, 0];
      game.paddleRight = 0;
      var x = game.config.FIELD_WIDTH - game.config.BALL_RADIUS -
              game.config.PADDLE_WIDTH;
      game.ball = [x, 100];
      game.step();
      expect(game.ballDelta).to.be.eql([1, 0]);
      expect(game.ball[0]).to.be.above(x);
    });
  });
});
