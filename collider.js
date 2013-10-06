(function(){
  //GameBoard data
  var gameOptions = {
    width: 700,
    height: 450,
    nEnemies: 10,
    padding: 20
  };

  //Scoreboard data
  var gameStats = {
    score: 0,
    bestScore: 0
  };

  //Scales x and y coordinates to SVG board.
  var axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
    y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
  };

  //Creates the Gameboard as a DOM node
  var gameBoard = d3.select('.container')
    .append('svg:svg')
    .attr('width', gameOptions.width)
    .attr('height', gameOptions.height);

  //Player data for renderPlayer
  var createPlayer = function(){
    return _.range(0, 1).map(function(player){
      return {
        id: player,
        x: 50,
        y: 50
      };
    });
  };

  //function that makes player draggable
  var drag = d3.behavior.drag()
    .on("drag", function(d,i) {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d3.select(this).attr("transform", function(d,i){
        return "translate(" + [ d.x,d.y ] + ")";
    });
  });

  //Creates the player as a DOM node
  var renderPlayer = function(playerArray){
    //Adds player data to a non-existen circle
    var playerData = gameBoard
      .selectAll('circle.player')
      .data(playerArray, function(player){
        return player.id;
      });

    //Places player in center of board, colors it acqua,
    //and makes it draggable
    playerData
      .enter()
      .append('svg:circle')
      .attr('class', 'player')
      .attr('cx', function(player){
        return axes.x(player.x);
      })
      .attr('cy', function(player){
        return axes.y(player.y);
      })
      .attr('r', 10)
      .attr('fill', 'aqua')
      .call(drag);
  };

  //Creates an array of enemy data
  var createEnemies = function(){
    return _.range(0, gameOptions.nEnemies)
      .map(function(enemy){
        return {
          id: enemy,
          x: Math.random() * 100,
          y: Math.random() * 100
        };
      });
  };

  //makes enemy circles and appends them to the DOM
  var render = function(newEnemies){
    var enemyBoard = gameBoard
      .selectAll('circle.enemy')
      .data(newEnemies, function(d){
        return d.id;
    });

    //Appends enemy circles to the DOM
    enemyBoard
      .enter()
      .append('svg:circle')
      .attr('class', 'enemy')
      .attr('cx', function(enemy){
        return axes.x(enemy.x);
      })
      .attr('cy', function(enemy){
        return axes.y(enemy.y);
      })
      .attr('r', 10);

    return enemyBoard.transition()
      .duration(2000)
      .tween('custom', tweenCollisionDetection);
  };

  var tweenCollisionDetection = function(endData){
    var enemy = d3.select(this);

    var startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };

    var endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };

    return function(t){
      checkCollision(enemy); // Remember to update scores

      var enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };

      return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };

  var checkCollision = function(enemy){
    var players = d3.select('.player');
    // console.log(players.attr('cx'));
      // console.log(player);
      var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(players.attr('r'));
      var xDiff = parseFloat(enemy.attr('cx')) - parseFloat(players.attr('cx'));
      var yDiff = parseFloat(enemy.attr('cy')) - parseFloat(players.attr('cy'));
      // console.log(": ", radiusSum, xDiff, yDiff);
      var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (separation < radiusSum){
        collided();
      }
  };

  var collided = function(){
    console.log("Collided Collision Logged!");
    updateBestScore();
    gameStats.score = 0;
    return updateScore();
  };

  var newEnemies = createEnemies();
  render(newEnemies);

  setInterval(function(){
    var newEnemies = createEnemies();
    render(newEnemies);
  }, 2000);

  var newPlayer = createPlayer();
  renderPlayer(newPlayer);

  updateScore = function() {
    return d3.select('#current-score').text(gameStats.score.toString());
  };

  updateBestScore = function() {
    gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
    return d3.select('#best-score').text(gameStats.bestScore.toString());
  };

  var increaseScore = function(){
    gameStats.score += 1;
    updateScore();
  };

  setInterval(increaseScore, 500);

}).call(this);