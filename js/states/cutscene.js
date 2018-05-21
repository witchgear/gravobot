var Cutscene = function(game){};
Cutscene.prototype =
{
	preload: function()
	{
		game.load.path = 'assets/json/';
		game.load.json('cutscene_0', 'cutscene_0.json');

		game.load.path = 'assets/sfx/';
		game.load.audio('queentalk', 'queentalk.wav') ;

		game.load.path = 'assets/font/';
		game.load.bitmapFont('dialogueText','font.png','font.fnt');

		game.load.path = 'assets/img/sprites/'
		game.load.image('dialogueBox', 'dialoguebox.png') ;
	},
	create: function()
	{
		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Cutscene', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		stateText1 = game.add.text(8, 32, 'Press Q to switch states.', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});

		this.dialogueBox = game.add.sprite(0, (game.height * 3/4), 'dialogueBox') ;

		var textFile = game.cache.getJSON('cutscene_0');

		var voiceBlip = game.add.audio('queentalk', 0.3, true);


		this.dialogue = new Dialogue(game, textFile, 16, game.height * 3/4 + 3, 'dialogueText', voiceBlip, this.dialogueBox) ;

		game.add.existing(this.dialogue) ;



	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses space
		if(Q.justPressed() || this.dialogue.finished)
		{
			game.state.start('Level2');
		}
	},
}