var AnimManager= {
	__linesToBlink: [],
	__cachedBackground: false,
	__gridNeeded: true,
	__buttons: {},
	__lastDisplayedNextShape: false,
	__buttonClicked: false,
	__score: false,
	ctx: false,  								// tetris game
	ctx2: false, 								// tetris menu
	ctx3: false, 								// tetris input
	frmReqId: false,
	/**
	* initialize game and menu canvas
	*/
	init: function(){
		AnimManager.stop();
		
		AnimManager.ctx = ui.elements.tetrisGame.getContext("2d");
		AnimManager.ctx2 = ui.elements.tetrisMenu.getContext("2d");	
		AnimManager.ctx3 = ui.elements.tetrisInput.getContext("2d");		
		
		ui.elements.tetrisInput.width = ui.elements.tetrisInput.width;
		ui.elements.tetrisInput.height = ui.elements.tetrisInput.height;
		
		AnimManager.ctx3.fillStyle = "black";	
		AnimManager.ctx3.fillRect(0, 0, ui.elements.tetrisInput.width, ui.elements.tetrisInput.height);		

		
		AnimManager.__buttons['leftButton'] 	= new Button('left', new Dimension(new Position(5, 5), ui.dimensions.buttonWidth, ui.dimensions.inputHeight-10));
		AnimManager.__buttons['rightButton'] 	= new Button('right', new Dimension(new Position(2*ui.dimensions.buttonWidth+15, 5), ui.dimensions.buttonWidth, ui.dimensions.inputHeight-10));
		AnimManager.__buttons['upButton'] 		= new Button('up', new Dimension(new Position(ui.dimensions.buttonWidth+10, 5), ui.dimensions.buttonWidth, (ui.dimensions.inputHeight-10)/2));
		AnimManager.__buttons['downButton'] 	= new Button('down', new Dimension(new Position(ui.dimensions.buttonWidth+10,  (ui.dimensions.inputHeight-10)/2+10), ui.dimensions.buttonWidth, ui.dimensions.inputHeight-60));
		
		AnimManager.__score = new FloatingScore();
		
		AnimManager.anim();
	},
	/**
	* Start the animation loop
	*/
	anim: function() {
		AnimManager.frmReqId = requestAnimationFrame(AnimManager.anim);				
		
		// Draw background
		AnimManager.__drawBackground(); 		
		
		// Draw menu
		AnimManager.__drawMenu();

		// render tetris input (on mobile devices)
		AnimManager.__drawInput();
		
		// calling the core logic: it manages gravity according to the speed (constanst moving up) and adding new shapes if necessary
		globals.game.intervalCore();		

		// draw bricks
		globals.matrix.draw(AnimManager.ctx);
		
		// blink selected lines and displaying added score
		AnimManager.__linesToBlink.forEach((line)=>{
			AnimManager.__blinkLine(line);
		});	

		// display added score at the position of max line
		AnimManager.__score.draw(AnimManager.ctx);
	},
	/**
	* Draw the background of the game with the grid. The generated content is cached.
	*/
	__drawBackground: function(){
		// draw background image	
		if(!AnimManager.__cachedBackground){
			
			var canvas = document.createElement('canvas');
			
			canvas.width = ui.dimensions.gameWidth;
			canvas.height = ui.dimensions.gameHeight;
			
			var ctx = canvas.getContext("2d");
			
			var img = new Image();

			img.onload = function() {			
				ctx.drawImage(img, 0, 0, img.width, img.height,0,0,ui.dimensions.gameWidth, ui.dimensions.gameHeight); 
				
				// draw grid if it is needed (optional)
				if(AnimManager.__gridNeeded){
					// drawn lines vertically
					for(var x = 0; x <=ui.dimensions.gameWidth; x=x+ui.dimensions.blockSize){
						ctx.beginPath();
						ctx.strokeStyle  = "rgb(240 240 240 )";
						ctx.moveTo(x,0);
						ctx.lineTo(x,ui.dimensions.gameHeight);
						ctx.stroke();
					}
					
					// drawn lines horizontally
					for(var y = 0; y <=ui.dimensions.gameHeight; y=y+ui.dimensions.blockSize){
						ctx.beginPath();
						ctx.strokeStyle  = "rgb(240 240 240 )";
						ctx.moveTo(0, y);
						ctx.lineTo(ui.dimensions.gameWidth,y);
						ctx.stroke();
					}	
				}

				AnimManager.__cachedBackground = canvas;				
			};
			
			img.src = "img/background.jpg";
		} else{
			AnimManager.ctx.drawImage(AnimManager.__cachedBackground, 0, 0 );
		}
	},
	/**
	* Draw menu to display score, record, level and the next shape 
	*/
	__drawMenu: function(){
		// fill menu canvas
		AnimManager.ctx2.fillStyle = "black";
		AnimManager.ctx2.fillRect(0, 0, ui.dimensions.menuWidth, ui.dimensions.menuHeight);		
		
		// render score and level
		AnimManager.ctx2.font =  ui.dimensions.menuFontSize + "px Terminal";
		AnimManager.ctx2.fillStyle = "white";
		AnimManager.ctx2.fillText("SCORE: " + parseInt(globals.game.getScore()).toLocaleString() , 4, 16);
		AnimManager.ctx2.fillText("RECORD: " + parseInt(globals.game.getRecord()).toLocaleString() , 4, 34);
		AnimManager.ctx2.fillText("LEVEL: " + globals.game.getLevel(), 4, 52);
		
		// show previous displayed next shape until new next shape can be shown
		var nextShapeToDisplay = AnimManager.__lastDisplayedNextShape;
		
		if(globals.game.getNextShape() && globals.shapemanager.getShape() && globals.shapemanager.getShape().getPosition().x >= 4){
			nextShapeToDisplay = globals.game.getNextShape();
		}
		
		// remder the next shape	
		if(nextShapeToDisplay){
			nextShapeToDisplay.drawAsNextShape(AnimManager.ctx2);
			AnimManager.__lastDisplayedNextShape = nextShapeToDisplay;
		} else{
			ShapeFactory.create('EMPTY').drawAsNextShape(AnimManager.ctx2);
		}
	},
	/**
	* Draw input panel
	*/
	__drawInput: function(){
		Object.keys(AnimManager.__buttons).forEach(function(key){
			if(isNaN(key)){
				AnimManager.ctx3.drawImage(AnimManager.__buttons[key].draw(AnimManager.__buttonClicked==key), 
				AnimManager.__buttons[key].dimension.x, 
				AnimManager.__buttons[key].dimension.y);
			}
		});
	},
	/**
	* Blink a specific line
	*/
	__blinkLine: function(line){
		for(var y = 0; y <=10; y++){
			(new Brick('white')).draw(AnimManager.ctx, line, y);		
		}		
	},
	/**
	* Set grid is needed or not (the user can decide it)
	*/
	setGridNeeded: function(val){
		AnimManager.__gridNeeded = val;
		AnimManager.resetCache();
	},
	/**
	* Reset cache
	*/
	resetCache: function(){
		AnimManager.__cachedBackground = false;
	},	
	/**
	* Select lines to blink
	*/
	blinkLines: function(lines = []){
		AnimManager.__linesToBlink = lines;
		setTimeout(() => { AnimManager.__linesToBlink = []; }, 100);
	},
	/**
	* Set added score to display it for a short time 
	*/
	displayAddedScore: function(score, line){
		AnimManager.__score = new FloatingScore(score, line);		
		setTimeout(() => { AnimManager.__score = new FloatingScore(); }, 2000);
	},
	/**
	* Calculates from xy positions of touch event which button is touched
	*/
	whichButtonTouched: function(x, y){
		var result = false;
		
		Object.keys(AnimManager.__buttons).forEach(function(key){
			if(isNaN(key) && AnimManager.__buttons[key].positionInRange(new Position(x,y))){
				result = key;
			}
		});
		
		AnimManager.__buttonClicked = result;
				
		setTimeout(function(){
			AnimManager.__buttonClicked = false;
		}, 100);
				
		return result;
	},
	/**
	* Stop anim loop
	*/	
	stop: function(){
		if(this.frmReqId) cancelAnimationFrame(AnimManager.frmReqId);
	}
};
