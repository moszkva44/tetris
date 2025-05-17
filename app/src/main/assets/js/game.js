function Game(){
	this.cascade = false;
	this.extraShapes = false;
	this.level = 0;
	this.score = 0;
	this.nextShape = false;
	this.removedRowsNumber = 0;
	this.animManager = AnimManager;
	this.running = false;
	this.lastrun = window.performance.now();
	this.lastrunCascade = window.performance.now();
}

/**
* Manage shapes, add new shape if it is needed, manage line removing
*/
Game.prototype.intervalCore = function(){
	// If the game is paused avoid this call 
	if(!globals.game.running) return false;
	
	// Call registered callback event handler on the current shape if it is not a falling shape created by the cascademanager
	if(EventManager.__registeredCallback && !(globals.shapemanager.getShape() && globals.shapemanager.getShape().isFalling())){		
		EventManager.__registeredCallback();
		EventManager.__registeredCallback = false;
	}	
	
	// check last run time - if the difference is not enough, exit 
	if(window.performance.now() - this.lastrun < this.getSpeedBylevel()) return false;
	
	// if cascade mode is turned on, manage floating bricks too
	if(this.cascade){
		CascadeManager.getFloatingShapes();
		
		if(CascadeManager.__fallingShapes.length > 0){
			CascadeManager.moveFloatingShapesOneStepDown();
			this.lastrun = window.performance.now();
			return false;
		} 
	}	

	// check if there is an active shape that shapemanager is working on
	if(!globals.shapemanager.hasShape()){
		// if there is no active shape, create one if there is no prepared shape
		if(globals.game.nextShape==false){
			globals.game.nextShape = ShapeFactory.create(utils.getRandomShapeID());
		}
		
		// add shape to the matrix
		globals.shapemanager.addShape(globals.game.nextShape);
		
		// create the next shape
		globals.game.nextShape = ShapeFactory.create(utils.getRandomShapeID());		
	}		
	
	// move shape down permanently if it is not a falling one
	if(!globals.shapemanager.getShape().isFalling()) globals.shapemanager.move(MOVE.DOWN);
	
	// If the number of removed rows reaches 10 (sometimes it exceeds), set it to zero and call level up. 
	if(globals.game.removedRowsNumber > 0 && globals.game.removedRowsNumber>=globals.levelThresholds[this.getLevel()+1]){
		globals.game.removedRowsNumber = 0;
		globals.game.levelUp();
	}
	
	this.lastrun = window.performance.now();
};

/**
* Get speed by the current level
*/
Game.prototype.getSpeedBylevel = function(){
	return globals.levelFrequences[this.level];
}

/**
* Start a new game
*/
Game.prototype.start = function(level = 0){
	// Init a new game	
	this.init(level);
	
    globals.game = this;
	this.running = true;
};

/**
* Init a new game
*/
Game.prototype.init = function(level = 0){
	// Init a new game	
	
	this.level = parseInt(level);
	this.score = 0;
	this.nextShape = false;
	this.removedRowsNumber = 0;	
	this.running = false;
	this.lastrun = window.performance.now();
	
	globals.shapemanager = new ShapeManager();
	globals.matrix = new Matrix();	
	
	// calculate dimensions
	ui.init();
	
	AnimManager.init();
};

/**
* Get animManager object
*/
Game.prototype.getAnimManager = function(){
	return this.animManager;
}

/**
* Pause the game
*/
Game.prototype.pause = function(){
	globals.game.running = false;
	ui.renderPause();
};


/**
* Continue the game
**/
Game.prototype.continue = function(){
	globals.game.running = true;
	ui.renderContinue();
}

/**
* Get the current level
*/
Game.prototype.getLevel = function(){
	return this.level;
};

/**
* Set level up. There are 15 levels started from 0.
*/
Game.prototype.levelUp = function(){
	if(this.level < 15){
		this.level = this.level + 1; 
	}
	
	localStorage.setItem('tetris_reached_level', this.level);
};

/**
* Add score
*/
Game.prototype.addScore = function(score){
	this.score = this.score + score;
	
	if(this.score > localStorage.getItem('tetris_record')) localStorage.setItem('tetris_record', this.score);
};

/**
* Get score
*/
Game.prototype.getScore = function(){
	return this.score;
};

/**
* Get record -  It is coming from the localstorage. 
* If there is no stored entry and the current score is the highest so far, return the current score othervise return zero.
*/
Game.prototype.getRecord = function(){
	let record =  localStorage.getItem('tetris_record') ?  localStorage.getItem('tetris_record') : 0;
	
	return this.score > record ? this.score : record;
};

/**
* Call necessary operation if game is over. Stop the game, release the current shape, 
* save the score to the localStorage (it is needed) and call render game over
*/
Game.prototype.gameOver = function(){
	this.running = false;
	
	globals.shapemanager.removeShape();
	
	this.getAnimManager().stop();
	
	if(!localStorage.getItem('tetris_record') || parseInt(this.score) > parseInt(localStorage.getItem('tetris_record'))){
		localStorage.setItem('tetris_record', this.score);
	}
	
    ui.renderGameOver();
};

/**
* Get the instance of the next shape
*/
Game.prototype.getNextShape = function(){
	return this.nextShape;
};

/**
* Increase the number of removed rows by the given value. This property is important to calculate if level up is needed 
*/
Game.prototype.increaseRemovedRowsNumber = function(val){
	this.removedRowsNumber = this.removedRowsNumber + val;
};

/**
* Add score based on the indexes of removed row. 1st row -> 100, 2nd -> 200, 3rd -> 400 etc....
*/
Game.prototype.addScoreByRemovedRowIndexes = function(indexes){
	let scoring = [40,100,300,1200]; 
	let addedScore = (scoring[indexes.length-1] * (this.getLevel() + 1));
	
	// bonus if all rows are removed
	if(globals.matrix.isEmpty()){
		addedScore = addedScore +  5000 * (this.getLevel() + 1);
	}
	
	this.addScore(addedScore);
	
	return addedScore;
}
