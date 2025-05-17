var utils = {
	__bag: [],
	/**
	* Get a random shape identifier
	* It fills a bag with every piece once then shuffle the bag.
	* When a new shape is needed, it takes the last element from the bag.
	* If the bag gets empty, it refills the bag again.
	*/
	getRandomShapeID: function(){
		const shuffle = function(array){ 
			return array.map((a) => ({ sort: Math.random(), value: a }))
				.sort((a, b) => a.sort - b.sort)
				.map((a) => a.value); 
		}; 		
		
		if(utils.__bag.length==0){
			utils.__bag = shuffle(globals.game.extraShapes ? globals.extraShapes.concat(globals.shapes) : globals.shapes);
		}
		
		return utils.__bag.pop();
	},	
	/**
	* Get a random integer in the range of min and max
	*/
	getRandomInRange: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	/**
	* Get a column by its index from a 2d array
	*/	
	extractColumn: function(arr, column){
		return arr.map(x => x[column]);
	},
	/**
	* Get a row by its index from a 2d array
	*/
	extractRow: function(arr, row){
		return arr[row].map(x => x);
	},	
	/**
	* Sleep - duration in ms
	*/
	sleep: function(ms){ 
		return new Promise(res => setTimeout(res, ms)); 
	},
	/**
	* Get a loop with the start and end parameters. The callback function will be called inside the loop in every step with the current sequence
	*/
	getIterator: function(start, end, direction=1, callbackfunc){
		for(var i = (direction==1 ? start : end); (direction==1 ? i < end : i > start); i=(direction==1 ? i + 1 : i - 1)){
			callbackfunc(i);
		}		
	},
	/**
	* Rotate 2d array clockwise with 90 degrees 
	*/
	rotateMatrix: function(matrix){
		return matrix.map((val, index) => matrix.map(row => row[index]).reverse());		
	},
	/**
	* Get RGB code of a specified color name
	*/
	convertColorNameToRGB: function(str){
		var ctx = document.createElement('canvas').getContext('2d');
		ctx.fillStyle = str;
		return utils.convertHexToRgb(ctx.fillStyle);
	},
	convertHexToRgb: function(hex) {
	  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	  } : null;
	},
	/**
	* return true if the user visits application on mobile device otherwise return false
	*/
	isMobile: function(){
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	},	
	
	
};