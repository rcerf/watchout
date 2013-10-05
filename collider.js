(function(){
  var gameOptions = {
    width: 700,
    height: 450,
    nEnemies: 10,
    padding: 20
  };

  var gameStats = {
    score: 0,
    bestScore: 0
  };
  
  var axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
    y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
  };

  var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

  var createPlayer = function(){
    return _.range(0, 1).map(function(player){
      return {
        id: player,
        x: 50,
        y: 50
      };
    });
  };

  // var playerArray = [];
  // playerArray.push(player);
  // console.log(player);

  var renderPlayer = function(playerArray){
    var playerData = gameBoard.selectAll('circle.player').data(playerArray, function(player){
      return player.id;
    });


    playerData.enter().append('svg:circle').attr('class', 'player').attr('cx', function(player){
      return axes.x(player.x);
    }).attr('cy', function(player){
      return axes.y(player.y);
    }).attr('r', 10).attr('fill', 'aqua');

    d3.select("svg").on("click", function(){
      d3.select(".player").transition().duration(500).attr('cx', function(){
        return d3.mouse(this)[0];
        }).attr('cy', function(){
          return d3.mouse(this)[1];
      });
    });
  };

  var render = function(newEnemies){
    var enemyBoard = gameBoard.selectAll('circle.enemy').data(newEnemies, function(d){
      return d.id;
    });
    // debugger;
    enemyBoard.enter().append('svg:circle').attr('class', 'enemy').attr('cx', function(enemy){
      return axes.x(enemy.x);
    }).attr('cy', function(enemy){
      return axes.y(enemy.y);
    }).attr('r', 10);

    

    setInterval(function(){
      var newEnemyLocation = createEnemies();
      var newEnemyBoard = gameBoard.selectAll('circle.enemy').data(newEnemyLocation, function(d){
        return d.id;
      }).transition().duration(1000).attr('cx', function(enemy){
        return axes.x(enemy.x);
      }).attr('cy', function (enemy){
        return axes.y(enemy.y);
      }).attr('r', 10);
    }, 1000);
  };

  var createEnemies = function(){
    return _.range(0, gameOptions.nEnemies).map(function(enemy){
      return {
        id: enemy,
        x: Math.random() * 100,
        y: Math.random() * 100
      };
    });
  };
var newPlayer = createPlayer();
renderPlayer(newPlayer);
var newEnemies = createEnemies();
render(newEnemies);
// setInterval(function(){
//   d3.selectAll("circle").remove();
//   var newEnemypositions = createEnemies();
//   return render(newEnemypositions);
// }, 1000);




}).call(this);