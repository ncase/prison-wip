// Class
function Person(stageID){

	var self = this;

	// Properties
	self.dead = false;
	self.stage = Stages[stageID];
	self.graphics = Sim.peopleSVG.group();

	///////////////////////////////
	////// PRIMARY FUNCTIONS //////
	///////////////////////////////

	// Update
	self.update = function(){
		self.stage.during(self);
		Sim.config.person.drawUpdate(self);
	};

	// Kill
	self.kill = function(){
		self.dead = true;
		self.graphics.animate( {opacity:0}, Sim.ANIM_SPEED, mina.linear, function(){
			self.REMOVE_ME_PLZ = true;
			self.graphics.remove();
			if(Focus.person==self){
				Focus.removeFocus(); // Remove focus from self.
			}
		});
	}

	// Go to a Stage
	self.goto = function(stageID){

		// If dead, don't. do. anything.
		if(self.dead) return;

		// Find Box
		var nextStage = Stages[stageID];
		if(self.stage==nextStage) return; // you're already here

		// Do my current stage's goodbye
		self.stage.goodbye(self);

		// Go to that next stage
		self.stage = nextStage;
		var pos = _getRandomPositionInStage(self.stage);
		self.x = pos.x;
		self.y = pos.y;
		_animate();

		// Do my new stage's welcome
		self.stage.welcome(self);

	};

	///////////////////////////////
	////// ANIMATION HELPERS //////
	///////////////////////////////

	var _getRandomPositionInStage = function(stage){
		var box = stage.layout;
		var border = 15;
		var x = box.x + border;
		var y = box.y + border;
		var width = box.width - border*2;
		var height = box.height - border*2;
		return {
			x: x + Math.random()*width,
			y: y + Math.random()*height
		};
	};
	var _getMatrix = function(){
		var matrix = new Snap.Matrix();
		matrix.translate(self.x,self.y);
		matrix.scale(self.scale);
		return matrix;
	}
	var _animate = function(){
		self.graphics.animate( {transform:_getMatrix()}, Sim.ANIM_SPEED, mina.easeinout );
		if(self.isFocus) Focus.animate();
	};

	//////////////////////////////////
	////// SO, YOU'VE BEEN BORN //////
	//////////////////////////////////

	// Start at the start stage
	var pos = _getRandomPositionInStage(self.stage);
	self.x = pos.x;
	self.y = pos.y;
	self.scale = 0; // being born
	self.graphics.transform(_getMatrix());
	self.scale = 1; // being born
	_animate(); // Animate being born

	// BORN callback
	Sim.config.person.born(self);

	// DRAW INITIALIZE callback
	Sim.config.person.drawInitialize(self);	

	///////////////////////////
	////// MISCELLANEOUS //////
	///////////////////////////

	// Focus Shtuff
	self.isFocus = false;
	self.graphics.attr({
		cursor: "pointer"
	});
	self.graphics.mousedown(function(){
		Focus.setFocus(self);
	});

}