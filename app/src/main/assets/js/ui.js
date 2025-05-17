var ui = {
	dimensions: {},
	elements: {},
	/**
	* Init ui elements and calculates their dimensions
	*/
	init: function(){
		ui.dimensions = globals.ui.dimensions;
		
		// Init elements
		Object.keys(globals.ui.elements).forEach(function(key){ 
			if(isNaN(key)) ui.elements[key] = document.getElementById(key);
		});
		
		// calculate dimensions
		ui.dimensions.gameWidth = (window.innerWidth-20) - (window.innerWidth-20)%10;
		
		if(window.innerHeight - 210 < ui.dimensions.gameWidth/10 * (24-ui.dimensions.hiddenTopRows)){
			ui.dimensions.gameWidth  = ((window.innerHeight - 210) - ((window.innerHeight - 210)%(24-ui.dimensions.hiddenTopRows)))/(24-ui.dimensions.hiddenTopRows) * 10 ;
		}

		ui.dimensions.blockSize 			= ui.dimensions.gameWidth/10;
		ui.dimensions.gameHeight 			= ui.dimensions.blockSize * (24 - ui.dimensions.hiddenTopRows);
		ui.dimensions.menuWidth 			= ui.dimensions.gameWidth;
		ui.dimensions.nextBlockMarginLeft 	= ui.dimensions.gameWidth - 53;
		ui.dimensions.inputWidth 			= ui.dimensions.menuWidth;
		ui.dimensions.buttonWidth 			= ui.dimensions.inputWidth/3-7;
	
		// Set sizes
		ui.elements.tetrisGame.width 	= ui.dimensions.gameWidth;
		ui.elements.tetrisGame.height 	= ui.dimensions.gameHeight;
		ui.elements.tetrisMenu.width 	= ui.dimensions.menuWidth;		
		ui.elements.tetrisMenu.height 	= ui.dimensions.menuHeight;	
		ui.elements.menu.style.width 	= ui.dimensions.gameWidth + 'px';		
		ui.elements.tetrisInput.width 	= ui.dimensions.inputWidth;
		ui.elements.tetrisInput.height 	= ui.dimensions.inputHeight;
		ui.dimensions.menuFontSize 		= parseInt((16/217) *  ui.dimensions.nextBlockMarginLeft);		
		ui.dimensions.menuFontSize 		= ui.dimensions.menuFontSize > 16 ? 16 : ui.dimensions.menuFontSize;
				
		ui.dimensions.tetrisInputRect = ui.elements.tetrisInput.getBoundingClientRect();
		
		ui.elements.tetrisInput.style.backgroundColor='black';
		
		// bind event handlers to user input depending on coming from mobile/desktop
		if(utils.isMobile()){
			ui.elements.tetrisInput.addEventListener('touchstart', EventManager.touchHandler, {passive: false});
			
			ui.elements.tetrisInput.style.display = 'block';
		}else{
			window.addEventListener('keydown', EventManager.keyDownHandler, {passive: false});
			
			ui.elements.tetrisInput.style.display = 'none';
		}

		ui.elements.newButton.addEventListener('click', ui.renderStartScreen); 	
		ui.elements.pauseButton.addEventListener('click', globals.game.pause); 
		ui.elements.continueButton.addEventListener('click', globals.game.continue); 
		
		ui.setGridNeeded(localStorage.getItem('tetris_grid_needed') && localStorage.getItem('tetris_grid_needed')==1)
		
		ui.elements.gridOnButton.addEventListener('click', function(){ ui.setGridNeeded(true); });
		ui.elements.gridOffButton.addEventListener('click', function(){ ui.setGridNeeded(false); });	
		
		ui.elements.clickStartButton.addEventListener('click', function(){
			globals.game.cascade = (ui.elements.gameModeSelector.value==1);			
			globals.game.start((ui.elements.levelSelector.value < 15 && ui.elements.levelSelector.value > 0) ? ui.elements.levelSelector.value : 0);			
			ui.renderStart();
		});	

		ui.renderStartScreen(ui.elements.gameModeSelector.value);
	},
	/**
	* Render game over
	*/
	renderGameOver: function(){
		let pos = ui.coverThisElement(ui.elements.tetrisGame, ui.elements.game_over_screen);
		
		ui.elements.imgGameOver.src ="img/dog_laugh.gif";
		ui.elements.imgGameOver.style.width = (pos['width']-50) +  "px";
		
		ui.elements.pauseButton.style.display = "none";
	},
	/**
	* Render pause
	*/
	renderPause: function(){
		ui.elements.pauseButton.style.display = "none";
		ui.elements.continueButton.style.display = "";	
		ui.elements.newButton.style.display = 'none';

		ui.coverThisElement(ui.elements.tetrisGame, ui.elements.paused_screen);
		ui.elements.paused_screen.style.lineHeight = ui.elements.paused_screen.style.height;		
	},
	/**
	* Render continue
	*/
	renderContinue: function(){
		ui.elements.pauseButton.style.display = "";
		ui.elements.continueButton.style.display = "none";
		ui.elements.newButton.style.display = '';
		
		ui.elements.paused_screen.style.display = "none";	
	},
	/**
	* Render start after new button being clicked
	*/
	renderStartScreen: function(selectedLevel = 0){
		globals.game.running = false;
		
		ui.elements.pauseButton.style.display = "none";
		ui.elements.newButton.style.display = "none";
		ui.elements.continueButton.style.display = "none";	
		
		ui.elements.game_over_screen.style.display = "none";	
		
		ui.coverThisElement(ui.elements.tetrisGame, ui.elements.start_screen);
			
		ui.elements.start_screen.style.lineHeight = ui.elements.start_screen.style.height;				
		ui.elements.start_screen.style.verticalAlign = "middle";			
		ui.elements.start_screen.style.textAlign = "center";
		
		let maxLevel = selectedLevel > 0 ? selectedLevel : localStorage.getItem('tetris_reached_level');
		
		maxLevel = (maxLevel > 0 && maxLevel <=15) ? maxLevel : 0;
		
		let l = ui.elements.levelSelector.options.length;
		
		// reset the level selector listbox
		for(let i = l-1; i >= 0; i--) {
			ui.elements.levelSelector.remove(i);
		}		
		
		// add options in line with which levels being reached by the user
		for(let i = 0; i <=maxLevel; i++){
			let option = document.createElement("option");
			
			option.value=i;
			option.text = 'Level ' + i;
			
			ui.elements.levelSelector.add(option);
		}
	},	
	/**
	* Render start after new button being clicked
	*/
	renderStart: function(){
		ui.elements.pauseButton.style.display = "";
		ui.elements.newButton.style.display = "";
		ui.elements.continueButton.style.display = "none";	
		
		ui.elements.game_over_screen.style.display = "none";

		ui.elements.start_screen.style.display = "none";
	},
	/**
	* Set grid needed or not needed
	*/
	setGridNeeded: function(val){
		if(val){
			ui.elements.gridOnButton.style.display = 'none';
			ui.elements.gridOffButton.style.display = '';
			
			globals.game.getAnimManager().setGridNeeded(true);
			
			localStorage.setItem('tetris_grid_needed', 1);
		} else{		
			ui.elements.gridOnButton.style.display = '';
			ui.elements.gridOffButton.style.display = 'none';	

			globals.game.getAnimManager().setGridNeeded(false);
			
			localStorage.setItem('tetris_grid_needed', 0);
		}		
	},
	coverThisElement: function(coveredObject, coverWidth){
		let pos = coveredObject.getBoundingClientRect();
		
		coverWidth.style.top = pos['top'];
		coverWidth.style.left = pos['left'];		
		coverWidth.style.width = pos['width'] +  "px";
		coverWidth.style.height = pos['height'] +  "px";	
		coverWidth.style.display = "block";			
		
		return pos;
	},	
};





