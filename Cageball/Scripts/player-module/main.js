(function () {

  var keys = {};
		
  window.addEventListener ("keydown", function(event){
	 keys[event.which] = true;
  });
  window.addEventListener("keyup", function(event){
	delete keys[event.which];
  });
  
var size = 10, dir;
var stage, layer;
var speed = 30;

var gameFieldWidth = 100, gameFieldHeight = 100;
var gameField = [[], []];
var player;

function initKinetic() {
	stage = new Kinetic.Stage({
		container: 'canvas',
		width: 450,
		height: 350
	});
	layer = new Kinetic.Layer();
}

var Cell = function (x, y) {
	this.width = size;
	this.height = size;
	this.color = "black";
	this.x = x;
	this.y = y;
	
	this.circle = new Kinetic.Circle({
		x: this.x * size  + size / 2,
		y: this.y * size  + size / 2,
		radius: size / 2,
		fill: 'red',
		visible: false
	});
	
	this.show = function () {
		this.circle.show();
		this.circle.draw();
	}
}

var Player = function (cell) {
	this.cell = cell;
	this.x = cell.x;
	this.y = cell.y;

	this.draw = function () {
		var circle = new Kinetic.Circle({
			width: size,
			height: size
		});
	}

	this.updatePlayerPosition = function (x, y) {
		this.x = x;
		this.y = y;
	}
}

function initGameField() {
	for (var i = 0; i < gameFieldWidth; i++) {
		gameField[i] = [];
		for (var j = 0; j < gameFieldHeight; j++) {
			var cell = new Cell(i, j);
			gameField[i][j] = cell;
			var rect = new Kinetic.Rect({
				x: cell.x * size,
				y: cell.y * size,
				width: cell.width,
				height: cell.height,
				fill: cell.color,
				stroke: 'white'
			});
			
			layer.add(rect);
			layer.add(cell.circle);
		}
	}
}

function initPlayer() {
	var playerCell = gameField[0][0];
	playerCell.show();
	player = new Player(playerCell);
}

function processNextMove(x, y) {
	if(x >= 0 && x < gameFieldWidth && y >= 0 && y < gameFieldHeight) {
		var nextCell = gameField[x][y];
		nextCell.show();
		player = nextCell;
	}
}

function processUserInput() {
	if(keys[37]) {
		processNextMove(player.x - 1, player.y);
	} else if(keys[38]) {
		processNextMove(player.x, player.y - 1);
	} else if (keys[39]) {
		processNextMove(player.x + 1, player.y);
	} else if(keys[40]) {
		processNextMove(player.x, player.y + 1);
	}
	
	setTimeout(processUserInput, 10);
}

function init() {
	initKinetic();
	initGameField();
	initPlayer();
	
	processUserInput();
}

init();
stage.add(layer);
}());