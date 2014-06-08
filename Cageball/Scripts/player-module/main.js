var size = 10, dir;
var stage, layer;

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
	stage.add(layer);
}

var Cell = function (x, y) {
	this.width = size;
	this.height = size;
	this.color = "black";
	this.x = x;
	this.y = y;
	this.show = function () {
		var circle = new Kinetic.Circle({
			x: this.x * size  + size / 2,
			y: this.y * size  + size / 2,
			radius: size / 2,
			fill: 'red',
		});
		layer.add(circle);
		layer.draw();
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
	document.onkeydown = function (e) {
		var key = e.keyCode;
		if(key == 37) {
			setTimeout(function() { processNextMove(player.x - 1, player.y); }, 30);
		} else if(key == 38) {
			setTimeout(function() { processNextMove(player.x, player.y - 1); }, 30);
		} else if (key == 39) {
			setTimeout(function() { processNextMove(player.x + 1, player.y); }, 30);
		} else if(key == 40) {
			setTimeout(function() { processNextMove(player.x, player.y + 1); }, 30);
		}

		if (key) e.preventDefault();
		
	}
}

function init() {
	initKinetic();
	initGameField();
	initPlayer();
	layer.draw();
	
	processUserInput();
}

init();