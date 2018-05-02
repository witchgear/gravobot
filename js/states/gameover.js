var GameOver = function(game){};
GameOver.prototype =
{
	preload: function()
	{
		
	},
	create: function()
	{
		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Game Over', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		stateText1 = game.add.text(8, 32, 'Press Spacebar to switch states.', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses space
		if(SPACEBAR.justPressed())
		{
			game.state.start('TitleScreen');
		}
	},
}

//adds states to state manager and starts at the title screen
game.state.add('TitleScreen', TitleScreen);
game.state.add('Tutorial', Tutorial);
game.state.add('Level1', Level1);
game.state.add('Level2', Level2);
game.state.add('Level3', Level3);
game.state.add('Cutscene', Cutscene);
game.state.add('GameOver', GameOver);
game.state.start('TitleScreen');