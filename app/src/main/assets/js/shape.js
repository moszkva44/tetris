/**
* Represent a shape with a matrix that have points and at poinst there can be either a brick or nothing (zero)
*/
var Shape = function(type){
	this.type 		= type;
	this.__matrix 	= [];
	this.__falling 	= false;
	this.__added 	= false;
	this.__pos 		= new Position(0,0);
}

/**
* Set matrix of the shape
*/
Shape.prototype.setMatrix = function(matrix){
	this.__matrix = matrix;
}
/*
* Get matrix of the shape
*/
Shape.prototype.getMatrix = function(){
	return this.__matrix;
}

Shape.prototype.isFalling = function(){
	return this.__falling;
}

Shape.prototype.isAdded = function(){
	return this.__added;
}

Shape.prototype.setAdded = function(){
	this.__added = true;
}

/**
* Get formatted matrix extended to 4 rows and 4 columns that can be displayed as a next shape
*/
Shape.prototype.getFormattedMatrix = function(){
	var formattedMatrix = [];
	
	if(this.__matrix.length==4){
		formattedMatrix = this.__matrix;
	} else if(this.__matrix.length==2){
		formattedMatrix = [[0,0,0,0], [0,1,1,0], [0,1,1,0],[0,0,0,0]];
	} else {
		var onlyZerosIn1stColumn = utils.extractColumn(this.__matrix, 0).indexOf(1)==-1;
		
		this.__matrix.forEach(function(row){
			var cols = [];
			
			row.forEach(function(col){
				cols.push(col);
			});
			
			cols = onlyZerosIn1stColumn ? cols.concat([0]) : [0].concat(cols);
			
			formattedMatrix.push(cols);
		});
		
		formattedMatrix.push([0,0,0,0]);
	}
	
	return formattedMatrix;
}

/**
* Get absolute position of matrix points
*/
Shape.prototype.getPoints = function(){
	var points = [];
	
	var pos = this.__pos;
	
	this.__matrix.forEach(function(row, x){
		row.forEach(function(col, y){
			if(col==1){
				points.push(new PositionedBrick(col, new Position(pos.x + x, pos.y + y)));
			}
		});
	});	
	
	return points;
}


/**
* Set absolute position of the whole shape
*/
Shape.prototype.setPosition = function(x, y){
	this.__pos = new Position(x, y);
}

/**
* Get absolute position of the shape
*/
Shape.prototype.getPosition = function(){
	return this.__pos;
}


/**
* return true if the shape has this brick instance
*/
Shape.prototype.hasThisBrick = function(brick){
	var ret = false;
	
	this.__matrix.forEach(function(row, i){
		row.forEach(function(col, j){
			if(col===brick){
				ret = true;
				return;
			}
		});
	});		
	
	return ret;
}

/**
* return a rotated matrix of the shape
*/
Shape.prototype.rotate = function(){
	return utils.rotateMatrix(this.__matrix);
}

/**
* Check if (at the moment of the shape being placed) the shape has at least one point that is outside of the table.
* It can be used for checking game over
*/
Shape.prototype.placedOnTop = function(){
	var result = false;
	var currPos = this.__pos;
	
	this.__matrix.forEach(function(row, x){
		row.forEach(function(col, y){
			if(x + currPos.x==3){
				result = true;
				return;
			}
		});
	});	
	
	return result;
}

/**
* Draw next shape to the given context
*/
Shape.prototype.drawAsNextShape = function(ctx){	
	this.getFormattedMatrix().forEach(function(row,x){
		row.forEach(function(col,y){
			(new Brick(col==1 ? 'gray' : 'rgb(216 217 232)', 'white')).drawAsNext(ctx, x, y);
		});
	});		
}






