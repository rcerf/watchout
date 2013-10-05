(function(){
  var gameOptions = {
    width: 700,
    height: 450,
    nEnemies: 30,
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
  
  var gameBoard = d3.select('.container').append('svg').attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

  var render = function(newEnemies){
    var enemyBoard = gameBoard.selectAll('circle.enemy').data(newEnemies, function(d){
      return d.id;
    });

    enemyBoard.enter().append('svg:circle').attr('class', 'enemy').attr()
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

var newEnemies = createEnemies();


}).call(this);