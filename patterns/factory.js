
// Constructor for defining new players
function Player (options) {
	// Some defaults
	this.name = options.name || 'New Player';
	this.team = options.team || 'New Team';
	this.position = options.position || 'New Position';
	this.ppg = options.ppg || 0;
	this.rpg = options.rpg || 0;
}

// Define skeleton Player factory
function PlayerFactory() {}

PlayerFactory.prototype.playerClass = Player;

// Factory method for creating new player instances
PlayerFactory.prototype.createPlayer = function (options) {
	
	this.playerClass = Player;

	return new this.playerClass(options);
};

var playerFactory = new PlayerFactory();

var p1 = playerFactory.createPlayer({
	name: 'Kobe Bryant',
	team: 'Lakers',
	position: 'SG',
	ppg: 21,
	rpg: 4.5
});

var p2 = playerFactory.createPlayer({
	name: 'Isiah Thomas',
	team: 'Celtics',
	position: 'PG',
	ppg: 21,
	rpg: 7
});

console.log(p1);
console.log(p2);
