/**
* Represents a button in the mobile input
*/
function Button(name, dimension){
	this.name = name;
	this.dimension = dimension;
	this.cachedImage = {'touched': false, 'untouched': false}
};

/**
* return true if the given posX and posY in the range of the current button
*/
Button.prototype.positionInRange = function(pos){
	return pos.x >= this.dimension.x && pos.x <= this.dimension.x2 && pos.y >=this.dimension.y && pos.y <= this.dimension.y2;
}

/**
* Draw the button. Cache the image once it is drawned then return the cached image only
*/
Button.prototype.draw = function(touched = false){
	var key = touched ? 'touched' : 'untouched';
	
	if(!this.cachedImage[key]){
		var canvas = document.createElement('canvas');
		
		canvas.width = this.dimension.width+10;
		canvas.height = this.dimension.height+10;
		
		var ctx = canvas.getContext("2d");
		
		var img = new Image();		
		
		img.onload = () => {	
			ctx.drawImage(img, 0, 0, 400, 400, 0, 0, this.dimension.width, this.dimension.height); 
		};
		
		img.src = touched ? "img/" + this.name + "_touched.png" : "img/" + this.name + ".png";

		this.cachedImage[key] = canvas;
	}

	return this.cachedImage[key];
}