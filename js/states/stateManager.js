//adds states to state manager and starts at the title screen
game.state.add('Boot', Boot);
game.state.add('Title', Title);
game.state.add('Tutorial', Tutorial);
game.state.add('Level1', Level1);
game.state.add('Level2', Level2);
game.state.add('Level3', Level3);
game.state.add('Cutscene', Cutscene);
game.state.add('GameOver', GameOver);
game.state.start('Boot');