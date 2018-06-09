var volume;
var Settings = function(game) {};
Title.prototype = {
	preload: function() {

	}
	create: function() {
		this.volumeText = game.add.bitmapText(500,100,'menutext','Volume',32);
		this.controlText = game.add.bitmapText(500,200,'menutext','Controls'32);
	}
	update: function() {
	}
}
game.state.add('Settings', Settings);
game.state.start('Settings');