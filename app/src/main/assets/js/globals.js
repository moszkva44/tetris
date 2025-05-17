var globals = {
	matrix: [],																							// The matrix instance
	game: null,																							// The Game instance
	shapemanager: null,																					// The ShapManager instance
	ui:{dimensions: {}, elements:{}},
	shapes: ['I', 'T', 'O', 'J', 'L', 'S', 'Z'],														// Identifiers of basic shapes	
	extraShapes: ['H', 'X', 'U', 'D', '1', '2', '/'],													// Identifiers of extra shapes			
	levelFrequences: [400, 380, 360, 340, 320, 300, 275, 250, 225, 200, 175, 150, 125, 120, 115, 100],	// //the original was: Math.pow((0.8-((this.level-1)*0.007)),(this.level-1))*1000;
	levelThresholds: [0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9, 9, 10],								// amount of removed rows that is needed to level up
};

// DOM elements' IDs to make objects from them
globals.ui.elements = {
	tetrisInput: false,
	tetrisGame: false,
	tetrisMenu: false,
	menu: false,
	newButton: false,
	pauseButton: false,
	continueButton: false,
	gridOnButton: false,
	gridOffButton: false,
	game_over_screen: false,
	paused_screen: false,
	imgGameOver: false,
	start_screen: false,
	clickStartButton: false,
	gameModeSelector: false,
	levelSelector: false
};

// dimensions default values of ui elements
globals.ui.dimensions = {
	blockSize:-1,
	hiddenTopRows:4,
	gameWidth:-1,
	gameHeight : -1,
	menuWidth: -1,
	menuHeight: 60,
	nextBlockSize: 12,
	nextBlockMarginLeft:-1,
	nextBlockMarginTop: 7,	
	menuFontSize: -1,
	inputWidth: -1,
	inputHeight: 100,
	buttonWidth: -1,
	tetrisInputRect: -1,
};