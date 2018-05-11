/*
title screen javascript code for gravobot
if you want to add something new to the code, cmnd+f "important note,"
these notes all apply to how to modify this code for more options
note: here what i call a "menu state" is basically a place where the cursor is in the menu, menu state 1 is defined as the new game option, menu state 2
	  is settings. making a new menu state woudl basically be a new option or place to go on the title menu, and any code held within a menu state is where
	  you can put what happens on a space or enter or whatever press in the title screen / menu/ etc. for any further questions contact phi.
*/

var game = new Phaser.Game(1000,600,Phaser.AUTO);
var menuExists = false;
var menuState = 1;

var Title = function(game) {};
Title.prototype = {
	preload: function() {
		game.load.image('logo','logov1.png'); // loads logo
		game.load.image('icon','tempicon.png'); //loads an image to be a scroller, its labelled as temp in case we want to use a different image later
		game.load.bitmapFont('menutext','font/font.png','font/font.fnt'); //loads bitmap font
	},
	create: function() {
		game.stage.backgroundColor = "#0b094e"; //background
		//space to start text
		this.titleText = game.add.bitmapText(500, 450, 'menutext','Press Space to Start', 32);
		this.titleText.anchor.x = 0.5;
		this.titleText.anchor.y = 0.5;
		//logo
		this.logo = this.add.sprite(500,250,'logo');
		this.logo.anchor.x = 0.5;
		this.logo.anchor.y = 0.5;
		//keys		
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //makes space work
		cursors = this.input.keyboard.createCursorKeys(); //arrow keys (didnt wind up using them but i dont think i needed to delete)
		this.down = game.input.keyboard.addKey(Phaser.Keyboard.S); //wasd up
		this.up = game.input.keyboard.addKey(Phaser.Keyboard.W); //wasd down
	},
	update: function() {
		//calls create menu
		if (this.spaceKey.justPressed()&&menuExists==false){
			this.createMenu();
		}
		//works the existing menu
		if (menuExists){
			this.workMenu();
		}
	},
	createMenu: function() {
		this.titleText.kill(); //deletes the space to start text
		//creates an option for menustate1, in this case new game
		this.newGame = game.add.bitmapText(500,425, 'menutext','New Game', 32);
		this.newGame.anchor.x=0.5;
		this.newGame.anchor.y=0.5
		//creates an option for menustate2, in this case settings
		this.settings = game.add.bitmapText(500,475,'menutext', 'Settings',32);
		this.settings.anchor.x=0.5;
		this.settings.anchor.y=0.5;

		//if a third menustate wants to add it would go here, use the following settings
		/*
		IMPORTANT NOTE
		this.[name] = game.add.bitmapText(500,[destination 50px lower than the previous state],'[name]','[display text]',32);
		this.[name].anchor.x = 0.5;
		this.[name].anchor.y = 0.5;
		*/

		//icon
		this.icon = this.add.sprite(500-this.newGame.width*.75,this.newGame.y,'icon');
		this.icon.anchor.y=0.5;
		//sets the menu flag to true so no extra menus can be created
		menuExists = true;
	},
	workMenu: function(){
		//moves menu state down on a down button
		if (this.down.justPressed()){
			menuState=menuState+1;
		}
		//moves menu state up on an up button
		if (this.up.justPressed()){
			menuState=menuState-1;
		}
		//if you go down too far, loop back to the top
		if (menuState>=3){ //IMPORTANT NOTE: if menu state list is updated make this number one above the new number of enu states
			menuState=1;
		}
		//if you go up too far, loop back to the bottom 
		if (menuState<=0){
			menuState=2;
		}
		//in state one, this occurs
		if (menuState==1){
			this.icon.position.x=500-this.newGame.width*.75;
			this.icon.position.y=this.newGame.y;
			//IMPORTANT NOTE: any things you want to happen upon reaching this part, 
			//eg on space press in this state start game: write code here
		}
		//in state two, this occurs
		else if (menuState==2){
			this.icon.position.x=500-this.settings.width*.75;
			this.icon.position.y=this.settings.y;
			//IMPORTANT NOTE: any things you want to occur upon reaching this part, eg on space press open a settings state, add code here
		}
		

	}
}
game.state.add('Title', Title);
game.state.start('Title');