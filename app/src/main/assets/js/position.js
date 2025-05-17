/**
* Represent a position
*/
function Position(x,y){
	this.x = x;
	this.y = y;
}

/**
* Represent a dimansion. A position with  widht and height.
*/
function Dimension(position, width, height){
	this.position = position;
	this.width = width;
	this.height = height;		
}


Object.defineProperty(Dimension.prototype, "x", {
    get: function() {
        return this.position.x;
    }
});

Object.defineProperty(Dimension.prototype, "y", {
    get: function() {
        return this.position.y;
    }
});

Object.defineProperty(Dimension.prototype, "x1", {
    get: function() {
        return this.position.x;
    }
});

Object.defineProperty(Dimension.prototype, "y1", {
    get: function() {
        return this.position.y;
    }
});

Object.defineProperty(Dimension.prototype, "x2", {
    get: function() {
        return this.position.x + this.width;
    }
});

Object.defineProperty(Dimension.prototype, "y2", {
    get: function() {
        return this.position.y + this.height;
    }
});

