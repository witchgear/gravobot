/*
title screen javascript code for gravobot
if you want to add something new to the code, cmnd+f "important note,"
these notes all apply to how to modify this code for more options
note: here what i call a "menu state" is basically a place where the cursor is in the menu, menu state 1 is defined as the new game option, menu state 2
	  is settings. making a new menu state woudl basically be a new option or place to go on the title menu, and any code held within a menu state is where
	  you can put what happens on a space or enter or whatever press in the title screen / menu/ etc. for any further questions contact phi.
*/
var menuExists = false;
var menuState = 1;

var Title = function(game) {};
Title.prototype = {
	preload: function() {
		createLoadingScreen();
		
		game.load.path = 'assets/img/backgrounds/';
		game.load.image('logo','logov1.png'); // loads logo
		game.load.path = 'assets/img/sprites/';
		game.load.image('icon','tempicon.png'); //loads an image to be a scroller, its labelled as temp in case we want to use a different image later

		game.load.path = 'assets/img/sprites/' ;
		game.load.atlas('atlas', 'atlas.png', 'atlas.json') ; // load atlas with gravity ball
		
		//load sound assets
		game.load.path = 'assets/music/';
		game.load.audio('title', ['title.mp3', 'title.ogg']);
		
		game.load.path = 'assets/sfx/';
		game.load.audio('scroll', ['scroll.mp3', 'scroll.ogg']);
		game.load.audio('confirm', ['confirm.mp3', 'confirm.ogg']);
		game.load.audio('back', ['back.mp3', 'back.ogg']);
	},
	create: function() {
		game.camera.x = game.camera.y = 0 ; // reset game camera to (0, 0) just in case
		menuState = 1 ; // reset menu state variable to 1
		menuExists = false ; // reset menuExists to false
		
		game.stage.backgroundColor = "#0b094e"; //background
		//space to start text
		this.titleText = game.add.bitmapText(500, 450, 'menutext','Click to Start', 32);
		this.titleText.anchor.x = 0.5;
		this.titleText.anchor.y = 0.5;
		//logo
		this.logo = this.add.sprite(500,250,'logo');
		this.logo.anchor.x = 0.5;
		this.logo.anchor.y = 0.5;

		this.ball = this.add.sprite(598, 216, 'atlas', 'gravityball') ; // add gravity ball to logo
		this.ball.anchor.x = this.ball.anchor.y = 0.5; // set anchor to middle of ball

		game.input.mouse.capture = true ; // allow for mouse input
		
		//create the sound objects
		//add.audio(key, volume, loop)
		this.confirmSound = game.add.audio('confirm', 0.7, false);
		this.scrollSound = game.add.audio('scroll', 0.7, false);
		this.titleTheme = game.add.audio('title', 0.4, true);
		
		//play title
		this.titleTheme.play();
	},
	update: function() {
		//works the existing menu
		//needs to happen before create so the same button press doesn't both create menu and start game
		if (menuExists){
			this.workMenu();
		}
		
		//calls create menu
		if (this.game.input.activePointer.justPressed(30)&&menuExists==false){
				this.titleTheme.stop();
				this.confirmSound.play();
				game.state.start('Cutscene1');
		}

		this.ball.angle += 1 ; // rotate ball
		
	},
	createMenu: function() {
		this.titleText.kill(); //deletes the space to start text
		//creates an option for menustate1, in this case new game
		this.newGame = game.add.bitmapText(500,425, 'menutext','New Game', 32);
		this.newGame.anchor.x=0.5;
		this.newGame.anchor.y=0.5
		//creates an option for menustate2, in this case settings
		//this.settings = game.add.bitmapText(500,475,'menutext', 'Settings',32);
		//this.settings.anchor.x=0.5;
		//this.settings.anchor.y=0.5;

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
		if (S.justPressed()){
			menuState=menuState+1;
			
			this.scrollSound.play(); //play sound
		}
		//moves menu state up on an up button
		if (W.justPressed()){
			menuState=menuState-1;
			
			this.scrollSound.play(); //play sound
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
			// console.log(this.newGame) ;
			// console.log(this.newGame) ;
			this.icon.position.x=500-this.newGame.width*.75;
			this.icon.position.y=this.newGame.y;
			
			//if space pressed on new game, go to first cutscene state
			if(SPACEBAR.justPressed())
			{
				this.titleTheme.stop();
				this.confirmSound.play();
				game.state.start('Cutscene1');
			}
		}
		//in state two, this occurs
		else if (menuState==2){
			this.icon.position.x=500-this.settings.width*.75;
			this.icon.position.y=this.settings.y;
			//IMPORTANT NOTE: any things you want to occur upon reaching this part, eg on space press open a settings state, add code here
		}
		

	}
}