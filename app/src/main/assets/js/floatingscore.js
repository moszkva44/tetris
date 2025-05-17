/**
* Represent a floating score that is displayed after rows being removed for a short time
*/
function FloatingScore(score = 0, line = 0){
	this.score = score;
	this.line = line;
	this.opacity = 1;
	this.y = (line * ui.dimensions.blockSize) - ui.dimensions.blockSize / 2;
	this.dy = -1;
}

/**
*  draw the score
*/
FloatingScore.prototype.draw = function(ctx){
	if(this.score > 0 && this.line > 0){		
		this.y = this.y + this.dy;
		
		ctx.font =  "20px Terminal bold";
		ctx.fillStyle = "rgba(255, 255, 255, " + this.opacity + ")";	
		ctx.fillText("+" + this.score , ui.dimensions.blockSize*4, this.y);			
		
		this.opacity = this.opacity - this.opacity / 120;
	}
};