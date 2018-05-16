var Cutscene = function(game){};
Cutscene.prototype =
{
	preload: function()
	{
		
	},
	create: function()
	{
		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Cutscene', 
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
			game.state.start('Level2');
		}
	},
}