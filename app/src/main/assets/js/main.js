
window.onload = function(){ 	
	globals.game = new Game();

	globals.game.init();	
}

window.onresize = function(){
	globals.game = new Game();

	globals.game.init();
	
	globals.game.getAnimManager().resetCache();
}


