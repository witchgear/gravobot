var Cutscene1 = function(game){};
Cutscene1.prototype =
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
		this.dialogueBox = game.add.sprite(0, (game.height * 3/4), 'dialogueBox') ;

		var textFile = game.cache.getJSON('cutscene_0');

		this.voiceBlip = game.add.audio('queentalk', 0.3, true);

		this.dialogue = new Dialogue(game, textFile, 16, game.height * 3/4 + 3, 'dialogueText', this.voiceBlip, this.dialogueBox) ;

		game.add.existing(this.dialogue) ;
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses Q
		if(Q.justPressed() || this.dialogue.finished)
		{
			this.voiceBlip.stop();
			game.state.start('Tutorial');
		}
	},
}