var Terrain = function(game, map, image){

	// call the Tilemap constructor within this object
	Phaser.Tilemap.call(game, map) ;

	// add image to tilemap
	//this.addTilesetImage(image) ;

	// create a new layer and resize the world its size
	this.layer = this.createLayer('Tile Layer 1') ;
	this.layer.resizeWorld() ;

	// set collision
	this.setCollisionByExclusion([]);
}

//link the gravity ball object's prototype to the Phaser.Tilemap object
Terrain.prototype = Object.create(Phaser.Tilemap.prototype) ;
Terrain.prototype.constructor = Terrain ;