/**
* Init a new matrix with the given size
*/
function Matrix(){
	this.__matrix = [];
	
	this.init();
}

/**
* Get matrix as an object
*/
Matrix.prototype.get = function(){
	return this.__matrix;
};

/**
* init the matrix with a size specified in the argument and fill it with zero values
*/
Matrix.prototype.init = function(){
	this.__matrix = [];
	
	var rows = { length: 24 };
	var cols = { length: 10 };
	
	Array.from(rows, () => Array.from(cols, () => 0)).forEach((row, x) => {
		this.__matrix[x] = [];
		row.forEach((column, y) => {
			this.__matrix[x][y] = 0;
		});
	});
};

/**
* Remove lines that contain bricks only and call the specified callback function with the indexes of removed rows
*/
Matrix.prototype.removeFullRows = function(callbackFunc){
	var tempMatrix = [];
	var removedRowsIndexes = [];
	
	this.__matrix.forEach((row, x) => {		
		if(row.join('').indexOf('0')==-1){
			tempMatrix = [new Array(10).fill(0, 0, 10)].concat(tempMatrix);
			removedRowsIndexes.push(x);
		} else{
			tempMatrix.push(row);
		}
	});	
	
	if(removedRowsIndexes.length > 0){
		callbackFunc(removedRowsIndexes);
	}

	this.__matrix = tempMatrix;
};

/*
* Draw the matrix by calling the draw funcktion of bricks one by one
*/
Matrix.prototype.draw = function(ctx){
	this.get().forEach(function(row, x){
		row.forEach(function(col, y){
			if(x > 3 && col==1){
				col.draw(ctx, x, y);
			}
		});
	});		
}

/*
* return if the matrix has no one brick
*/
Matrix.prototype.isEmpty = function(){
	var result = true;
	
	this.get().forEach((row, index) => {
		if(row.join('').indexOf('1') > -1 && index > 3){
			result = false;
			return;
		}
	});
	
	return result;
}


