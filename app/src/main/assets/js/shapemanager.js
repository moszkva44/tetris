const MOVE = {
	'LEFT':	new Direction(0,-1), 
	'RIGHT': new Direction(0,1), 
	'UP': new Direction(-1, 0), 
	'DOWN': new Direction(1,0)
};

/**
* Shapemanager - Manage only one dedicated shape that falls from above
*/
function ShapeManager(){
	this.__shape = false; 
}

/**
* Add a new shape to manage. This shape will fall from above
*/
ShapeManager.prototype.addShape = function(shape){
	this.__shape = shape;
	
	this.__shape.setAdded();
	
	this.__shape.setPosition(0,3);
	
	this.__shape.getPoints().forEach(function(pos){
		globals.matrix.get()[pos.x][pos.y] = pos.brick;
	});
};
	
/**
* does it have shape to manage?
*/
ShapeManager.prototype.hasShape = function(){
	return this.__shape!==false;
};

/**
* return the current shape under manage
*/
ShapeManager.prototype.getShape = function(){
	return this.__shape;
};

/**
* set a shape to manage it
*/
ShapeManager.prototype.setShape = function(shape){
	this.__shape = shape
};


/**
* Release the current shape
*/
ShapeManager.prototype.removeShape = function(){
	this.__shape = false;
};

/*
* Move the shape one step according to the given direction. 
* Bwfore making the move, check that the given movement is valid i.e: if the new position is not occupied or it is not outside of the table.
* When moving down, it checks if game is over and manage removing rows
*/
ShapeManager.prototype.move = function(dir, dontAddScoreForBePlaced = false){
	if(!this.__shape || !globals.game.running) return false;
	
	if(this.__check(dir)){
		var currPost = this.__shape.getPosition();
		
		this.__shape.getPoints().forEach(function(pos){
			globals.matrix.get()[pos.x][pos.y] = 0;
		});
		
		this.__shape.setPosition(currPost.x + dir.stepX, currPost.y + dir.stepY);
		
		this.__shape.getPoints().forEach(function(pos){
			globals.matrix.get()[pos.x][pos.y] = pos.brick;
		});	
	} else if(dir==MOVE.DOWN){
		// game over check
		if(this.__shape.placedOnTop()){
			globals.game.gameOver();
			return;
		}

		// remove full rows
		globals.matrix.removeFullRows(function(indexes){
			let score = globals.game.addScoreByRemovedRowIndexes(indexes);
			
			globals.game.getAnimManager().displayAddedScore(score, Math.min(...indexes));
			globals.game.getAnimManager().blinkLines(indexes);
			globals.game.increaseRemovedRowsNumber(indexes.length);	
		});			
		
		if(!dontAddScoreForBePlaced) globals.game.addScore(10);
		
		this.__shape = false;			
	}
};

/**
* Check if one step to the given direction is valid or not
*/
ShapeManager.prototype.__check = function(dir){
	if(!this.__shape) return false;
	
	var result = true;
	
	var shape = this.__shape;
	
	this.__shape.getPoints().forEach(function(pos){
		// check margin
		if((pos.y==0 && dir==MOVE.LEFT) || (pos.y==9 && dir==MOVE.RIGHT) || pos.x==23 && (dir==MOVE.DOWN)){
			result = false;
			return;
		}
		
		// check other elements
		if(globals.matrix.get()[pos.x + dir.stepX][pos.y + dir.stepY]==1 && !shape.hasThisBrick(globals.matrix.get()[pos.x + dir.stepX][pos.y + dir.stepY])){
			result = false;
		}			
	});

	return result;	
};

/**
* Check if one rotate on the shape is valid or not
*/
ShapeManager.prototype.__checkRotate = function(){
	var result = true;
	
	var tmpRotatedMatrix = this.__shape.rotate();
	
	var tmpShape = new Shape();
	
	tmpShape.setMatrix(tmpRotatedMatrix);
	tmpShape.setPosition(this.__shape.getPosition().x, this.__shape.getPosition().y);	
	
	tmpShape.getPoints().forEach(function(pos){
		// check margin
		if(pos.y > 9 || pos.y < 0 || pos.x > 23){
			result = false;
			return;
		}
		
		// check other elements
		if(globals.matrix.get()[pos.x][pos.y]==1 && !tmpShape.hasThisBrick(globals.matrix.get()[pos.x][pos.y])){
			result = false;
		}				
	});		
	
	return result;
};

/**
* Rotate the falling shape if it is valid
*/
ShapeManager.prototype.rotate = function(){
	if(this.__shape=='O' || this.__shape===false || !globals.game.running){
		return;
	}
	
	if(this.__checkRotate()){
		this.__shape.getPoints().forEach(function(pos){
			globals.matrix.get()[pos.x][pos.y] = 0;
		});
		
		this.__shape.setMatrix(this.__shape.rotate());
		
		this.__shape.getPoints().forEach(function(pos){
			globals.matrix.get()[pos.x][pos.y] = pos.brick;
		});	
	}
}