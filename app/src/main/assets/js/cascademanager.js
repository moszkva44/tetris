var CascadeManager = {
	__fallingShapes: [],
	/*
	* Get all floating bricks if there is no active (falling) shape
	*/
	getFloatingShapes: function(){
		var processedBricks = [];
		
		if(globals.shapemanager.hasShape() && globals.shapemanager.getShape().isAdded()) return false;
		
		for(var i = 0; i <= 9; i++){
			// Get the specified column
			var column = utils.extractColumn(globals.matrix.get(), i);
			
			// walk through the column like it was a vector
			column.forEach(function(element, index){
				let item = new PositionedBrick(column[index-1], new Position(index-1, i));

				// take every brick that is above an empty space (potentially floating)
				if(index > 3 && element==0 && column[index-1]!=0 && !CascadeManager.__isPositionedBrickInFallingShapes(item)){
					// collecting all of the bricks with the same color that are connected to the given one
					var result = true;
					let positionedBricks = CascadeManager.__searchSameGroup(index-1, i);
					
					positionedBricks.forEach(function(groupItem){
						if(groupItem.x == 23 || (globals.matrix.get()[groupItem.x+1][groupItem.y]==1 && globals.matrix.get()[groupItem.x+1][groupItem.y].getFillColor()!=groupItem.brick.getFillColor()))
							result = false;	
					});
					
					positionedBricks.push(item);
					
					// if only one of thesse bricks are stable, the given brick is not selected to move down
					if(result){
						CascadeManager.__fallingShapes.push(ShapeFactory.createFromPositionedBricks(positionedBricks, true));
					}
				}
				
				processedBricks.push(item);
			});
		}

		return CascadeManager.__fallingShapes;
	},
	/**
	* return true if a positionedBrick is already included in an array
	*/
	__isIncluded: function(arr, searchedItem){
		  return arr.some(function(el) {
			return el.x==searchedItem.x && el.y==searchedItem.y;
		  }); 
	},
	/**
	* return true if the given positionedBrick is already included in any falling shape
	*/
	__isPositionedBrickInFallingShapes: function(positionedBrick){
		var result = false;
		
		CascadeManager.__fallingShapes.forEach(function(shape){
			if(shape.hasThisBrick(positionedBrick.brick)){
				result = true;
				return;
			}
		});
		
		return result;
	},
	/*
	*  return all bricks with the same color that are conntected to each other making a group
	*/
	__searchSameGroup(x, y, bricks = []){ 
		if(y > 0 && globals.matrix.get()[x][y-1]==1 && globals.matrix.get()[x][y-1].getFillColor()==globals.matrix.get()[x][y].getFillColor()){
			let item = new PositionedBrick(globals.matrix.get()[x][y-1], new Position(x, y-1));
			
			if(!CascadeManager.__isIncluded(bricks, item)){
				bricks.push(item);
				bricks = CascadeManager.__searchSameGroup(x,y-1, bricks);
			}
		}
		
		if(y < 9 && globals.matrix.get()[x][y+1]==1 && globals.matrix.get()[x][y+1].getFillColor()==globals.matrix.get()[x][y].getFillColor()){
			let item = new PositionedBrick(globals.matrix.get()[x][y+1], new Position(x, y+1));
			
			
			if(!CascadeManager.__isIncluded(bricks, item)){
				bricks.push(item);
				bricks = CascadeManager.__searchSameGroup(x,y+1, bricks);
			}
		}
		
		if(x < 23 && x > 3){
			if(globals.matrix.get()[x-1][y]==1 && globals.matrix.get()[x-1][y].getFillColor()==globals.matrix.get()[x][y].getFillColor()){
				let item = new PositionedBrick(globals.matrix.get()[x-1][y], new Position(x-1, y));
				
				
				if(!CascadeManager.__isIncluded(bricks, item)){
					bricks.push(item);
					bricks = CascadeManager.__searchSameGroup(x-1,y, bricks);
				}
			}	

			if(globals.matrix.get()[x+1][y]==1 && globals.matrix.get()[x+1][y].getFillColor()==globals.matrix.get()[x][y].getFillColor()){
				let item = new PositionedBrick(globals.matrix.get()[x+1][y], new Position(x+1, y));
				
				if(!CascadeManager.__isIncluded(bricks, item)){
					bricks.push(item);
					bricks = CascadeManager.__searchSameGroup(x+1,y, bricks);
				}
			}
		}
		
		return bricks;
	},
	/**
	* Move all floating bricks one step down
	*/
	moveFloatingShapesOneStepDown(){
		var indexesToRemove = [];
		
		CascadeManager.__fallingShapes.forEach(function(shape, index){			
			globals.shapemanager.setShape(shape);
			globals.shapemanager.move(MOVE.DOWN, true);
			
			// if it is false it means that the shape is placed, it cannot fall further
			if(!globals.shapemanager.getShape() || shape.getMatrix().length==0)
				indexesToRemove.push(index);
		});
		
		indexesToRemove.forEach(function(index){
			CascadeManager.__fallingShapes.splice(index, 1);
		});
	},	
};