var EventManager = {
	__registeredCallback: false,
	keyMap: {"ArrowLeft": MOVE.LEFT, 'ArrowRight': MOVE.RIGHT, 'ArrowDown': MOVE.DOWN, 'ArrowUp': MOVE.UP},
	buttonMap: {"leftButton": MOVE.LEFT, 'rightButton': MOVE.RIGHT, 'downButton': MOVE.DOWN, 'upButton': MOVE.UP},

	/**
	* Handling user input coming from keyboard on desktop 
	*/
	keyDownHandler: function(event){
		event.preventDefault();
		event.stopPropagation();	
		
		EventManager.__callMoveOperation(EventManager.keyMap[event.key]);
	},
	/*
	* Handling user input coming from buttons on mobile
	*/
	touchHandler: function(event){
		event.preventDefault();
		event.stopPropagation();	
		
		var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
		var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
		
		EventManager.__callMoveOperation(EventManager.buttonMap[AnimManager.whichButtonTouched(clientX - ui.dimensions.tetrisInputRect['left'], clientY - ui.dimensions.tetrisInputRect['top'])]);	
	},
	/**
	* Call the move operation according to the given direction
	*/
	__callMoveOperation: function(dir){
		let fn = function(){};
		
		switch(dir){
			case MOVE.LEFT:
			case MOVE.RIGHT:
			case MOVE.DOWN:
				fn = function(){ globals.shapemanager.move(dir); }
			break;	

			case MOVE.UP:
				fn = function(){ globals.shapemanager.rotate(); }
			break;
		};
		
		EventManager.__registeredCallback = fn;
	}
}; 