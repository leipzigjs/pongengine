pongengine
==========

Pongengine is like, the name says, an engine that runs pong games on a node.js server. 
It provides an restfull API to get the games status, to log in to the game and to control 
the paddles.

The challenge
-------------

Build a server or client-side js which controlls the paddle and is able to beat all the other
challengers.

The rules are:

* Game configuration is variable: Fieldsize, ballspeed or any other value might change
* One game everyone on everyone, the two with most wins go for one final playoff game
* If there occur any bug in this code, they will get fixed, so stay tuned and test your code
  against the latest version available

Installation
------------

There are two ways to install the REST-Server. First you can install it via npm:

    $ npm install pongengine 

Second is to clone or fork this repository.

Start the server
----------------

You can start the server by simply call:

    $ node server.js

if you've installed it via *npm* you might use the correct path, like so:

    $ node node_modules/pongengine/server.js

Now you can open you browser and had to a game named "foo" by opening 
[http://localhost:8001/game/foo](http://localhost:8001/game/foo). Note that
you can choose the game by altering the url.

restfull API
------------

Beside the spectator route, which you've already used, there are several other routes

### get game status

* Route: GET /game/:key/status
* Returns: all relevant information about the game, like ball position, ball movement direction and scores

### get game config

* Route: GET /game/:key/config
* Returns: Basic configuration of the game, like sizes of the field, ball and paddles.

### start the game

* Route: POST /game/:key/start
* Returns: _ok_ if the game has started. Note that you normally don't need to start the game, since this is
done automatically if two players have logged in.

### login to the game

* Route: PUT /game/:key/player/:playername/
* Returns: a secret sting (to use like a cookie). Every time, you want to move your paddle, you have to provide
this secret to prevent the oponent from controlling yours.

### move paddle up

* Route: POST /game/:key/player/:playername/:secret/up/
* Returns: _ok_ if successful.  

**Note:** There are a maximum numbers of movements withing a time interval. If they are depleted, 
you get Status Code 500 and have to wait a while. You can get the number of movements available via
game status field _rightMoveCounter_ or _leftMoveCounter_ and config field _NUMBER_OF_PADDLE_MOVES_.

### move paddle down

* Route: POST /game/:key/player/:playername/:secret/down/
* Returns: _ok_ if successful.

_____________

License
-------

[MIT License](http://opensource.org/licenses/MIT)