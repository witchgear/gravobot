var Tunnel = function(game, t1, t2, t3, t4, x, y, key){
	
	//pointers to various layers of the tunnel
	this.t1 = t1 ;
	this.t1.anchor.x = 0.5 ;
	this.t1.anchor.y = 0.5 ;
	this.t1.position.x = x ;
	this.t1.position.y = y ;

	this.t2 = t2 ;
	this.t2.anchor.x = 0.5 ;
	this.t2.anchor.y = 0.5 ;
	this.t2.position.x = x ;
	this.t2.position.y = y ;

	this.t3 = t3 ;
	this.t3.anchor.x = 0.5 ;
	this.t3.anchor.y = 0.5 ;
	this.t3.position.x = x ;
	this.t3.position.y = y ;

	this.t4 = t4 ;
	this.t4.anchor.x = 0.5 ;
	this.t4.anchor.y = 0.5 ;
	this.t4.position.x = x ;
	this.t4.position.y = y ;
	this.alpha = 0.75;

	Phaser.Sprite.call(this, game, x, y, key) ;
	this.anchor.x = 0.5 ;
	this.anchor.y = 0.5 ;
	this.position.x = x ;
	this.position.y = y ;

	this.frameBuffer = 0 ;

	game.physics.arcade.enable(this);

} ;	// these are just pointers to the actual player and game objects


//link the gravity ball object's prototype to the Phaser.Sprite object
Tunnel.prototype = Object.create(Phaser.Sprite.prototype) ;
Tunnel.prototype.constructor = Tunnel ;

Tunnel.prototype.update = function() {

	// rotate tunnel
	this.frameBuffer++ ;
	if(this.frameBuffer % 2 == 0)
	{
		this.frameBuffer = 0 ;
		this.t1.angle += 1 ;
		this.t2.angle -= 2 ;
		this.t3.angle += 3 ;
		this.t4.angle -= 0.5 ;
		this.angle -= 4 ;
	}
	
}