/**
* Init a direction. A direction is described by a vertical and a horizontal step.
* i.e: LEFT direction is -1 step with Y (horizontally) and 0 step with Y (vertically)
*/
function Direction(stepX, stepY){
	this.stepX = parseInt(stepX);
	this.stepY = parseInt(stepY);
}