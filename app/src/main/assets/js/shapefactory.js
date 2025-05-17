var ShapeFactory = {
	__shapes: {
		'I': [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
		'O': [[1,1],[1,1]],
		'T': [[0,1,0],[1,1,1],[0,0,0]],
		'J': [[1,0,0],[1,1,1], [0,0,0]],
		'L': [[0,0,1],[1,1,1], [0,0,0]],
		'S': [[0,1,1],[1,1,0], [0,0,0]],
		'Z': [[1,1,0],[0,1,1], [0,0,0]],
		'EMPTY': [[0,0,0,0],[0,0,0,0], [0,0,0,0], [0,0,0,0]], // Empty shape
		'H': [[1,0,1],[1,1,1],[1,0,1]],
		'X': [[0,1,0], [1,1,1,], [0,1,0]],
		'U': [[1,0,1], [1,0,1], [1,1,1]],
		'D': [[1,1,1], [1,0,1], [1,1,1]],
		'1': [[1]],
		'2': [[0,0,0], [1,1,0], [0,0,0]],
		'/': [[0,1],[1,0]],
	},
	__colors: {
		'I': 'DarkCyan',	  	// LightBlue
		'J': 'blue',	  		// blue
		'O': 'Gold', 			// yellow 	
		'L': 'OrangeRed',    	// orange
		'S': 'green',	  		// green
		'Z': 'red',	  			// red
		'T': 'magenta', 		// magenta
		'EMPTY': 'white'
	},	
	/**
	* Create a shape by its one-character long identifier. Before return the instance, rotatete it random times.
	*/
	create: function(type){
		var shape = new Shape(type);
		
		var matrix = ShapeFactory.__shapes[type] || ShapeFactory.__shapes['O'];
		
		// rotate the matrix random times
		for(var i=0; i<= utils.getRandomInRange(0,3); i++){
			matrix = utils.rotateMatrix(matrix);	
		}
		
		// Replace every 1 in the matrix with a Brick object
		var brickMatrix = [];
		
		matrix.forEach(function(row, x){
			brickMatrix[x] = [];
			row.forEach(function(col, y){
				brickMatrix[x][y] = (col==1 ? new Brick(ShapeFactory.__colors[type]) : col);
			});
		});		
		
		shape.setMatrix(brickMatrix);
		
		return shape;
	},
	createFromPositionedBricks: function(positionedBricks, falling = false){
		// creating temporary matrix to map the original table
		var matrix = new Matrix();
		var shape = new Shape('B');
		var tmpMatrix = [];
		var newMatrix = [];
		var posX = false;
		var posY = false;
		
		matrix.init();
		
		// put bricks into the temporary matrix 
		positionedBricks.forEach(function(positionedBrick){
			matrix.get()[positionedBrick.x][positionedBrick.y] = positionedBrick.brick;
		});	

		// reduce the size of the matrix as much as possible
		
		// removing empty rows that contain zeros only
		matrix.get().forEach(function(row, x){
			var cols = [];
			
			row.forEach(function(col){
				cols.push(col);
			});
			
			if(cols.join('').indexOf('1') > -1){
				if(posX===false) posX = x;
				
				tmpMatrix.push(cols);
			}
		});
		
		var newY = 0;
		
		// removing empty cols that contain zeros only
		for(var y = 0; y <= 9; y++){
			//Get the specified column
			var column = utils.extractColumn(tmpMatrix, y);
			
			var rows = [];
			
			column.forEach(function(val){
				rows.push(val);
			});
			
			if(rows.join('').indexOf('1') > -1){
				if(posY===false) posY = y;
				
				rows.forEach(function(val, x){
					if(newMatrix[x]=== undefined) newMatrix[x] = []; 
					newMatrix[x][newY] = val;
				});
				
				newY++;
			}			
		}
		
		shape.setMatrix(newMatrix);
		shape.setPosition(posX, posY);
		
		shape.__falling = falling;
		
		return shape;
	}
	
};