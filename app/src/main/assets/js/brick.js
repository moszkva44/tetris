/**
* Represent a brick. A shape consist of bricks. Its value is always 1.
*/
function Brick(fillColor = 'rgb(79 49 97)', borderColor = 'white'){
	this.value = 1;
	this.fillColor = fillColor;
	this.borderColor = borderColor;
	this.falling = false;

}

/**
* To store already generated backgrounds by color
*/ 
Brick.__cachedBackground = {};

/**
* return object as a number that is always 1
*/
Brick.prototype.valueOf = function(){
	return this.value;
};

/**
* return object as a string that is always 1
*/
Brick.prototype.toString = function(){
	return this.value;
};

/**
* Get fill color
*/
Brick.prototype.getFillColor = function(){
	return this.fillColor;
};

/**
* Set fill color
*/
Brick.prototype.setFillColor = function(val){
	this.fillColor = val;
};

/*-
* Set border color
*/
Brick.prototype.setBorderColor = function(val){
	this.borderColor = val;
};

/*-
* Get border color
*/
Brick.prototype.getBorderColor = function(){
	return this.borderColor;
};

/**
* Draw brick to the given position (from cache)
*/
Brick.prototype.draw = function(ctx, x, y){	
	var d = new Dimension(new Position(y*ui.dimensions.blockSize, (x-ui.dimensions.hiddenTopRows)*ui.dimensions.blockSize), ui.dimensions.blockSize, ui.dimensions.blockSize);
	
	if(!Brick.__cachedBackground[this.fillColor]){
		var canvas = document.createElement('canvas');
		
		canvas.width = ui.dimensions.blockSize,
		canvas.height = ui.dimensions.blockSize;
		
		var ctxTmp = canvas.getContext("2d");
		
		var img = new Image();
		
		var rgb = utils.convertColorNameToRGB(this.fillColor);
		
		img.onload = () => {
			ctxTmp.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
			
			ctxTmp.fillStyle =`rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
			
			ctxTmp.fillRect(0, 0, d.width, d.height);	
			
			ctxTmp.strokeStyle = this.borderColor;
			ctxTmp.strokeRect(0, 0, d.width, d.height);	
			
			Brick.__cachedBackground[this.fillColor] = canvas;
			
			this.draw(ctx, x, y);				
		};	
		
		img.src = "img/brick.png";
		
	} else {
		ctx.drawImage(Brick.__cachedBackground[this.fillColor], d.x1, d.y1);	
	}
};

/**
* Draw brick to the given position
*/
Brick.prototype.drawAsNext = function(ctx, x, y){
	var d = new Dimension(new Position(y*ui.dimensions.nextBlockSize+ui.dimensions.nextBlockMarginLeft, x*ui.dimensions.nextBlockSize+ui.dimensions.nextBlockMarginTop), ui.dimensions.nextBlockSize, ui.dimensions.nextBlockSize);
	
	ctx.fillStyle = this.fillColor;
	ctx.fillRect(d.x1, d.y1, d.width, d.height);	

	ctx.strokeStyle = this.borderColor;
	ctx.strokeRect(d.x1, d.y1, d.width, d.height);	
};

function PositionedBrick(brick, position){
	this.brick = brick;
	this.position = position;
}

Object.defineProperty(PositionedBrick.prototype, "x", {
    get: function() {
        return this.position.x;
    }
});

Object.defineProperty(PositionedBrick.prototype, "y", {
    get: function() {
        return this.position.y;
    }
});


