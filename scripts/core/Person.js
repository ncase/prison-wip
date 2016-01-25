// Class
function Person(stageID){

	var self = this;

	// Properties
	self.dead = false;

	// Stage
	self.stage = Stages[stageID];

	// Graphics
	var svg = Sim.peopleSVG;
	var color = Snap.hsl(0, 0, 40+Math.random()*40);
	var body, eye1, eye2;
	self.graphics = svg.group(
		body=svg.circle(0,0,10).attr({fill:color}),
		eye1=svg.circle(-5,0,2).attr({fill:"#333"}),
		eye2=svg.circle(5,0,2).attr({fill:"#333"})
	);

	// Transform Helpers
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

	// Animation Helpers
	self.animate = function(){
		self.graphics.animate(
			{transform:_getMatrix()},
			Sim.ANIM_SPEED,
			mina.easeinout
		);
		// if(self.isFocus) Focus.animate();
	};

	// Start at the start stage
	var pos = _getRandomPositionInStage(self.stage);
	self.x = pos.x;
	self.y = pos.y;
	self.scale = 0; // being born
	self.graphics.transform(_getMatrix());
	self.scale = 1; // being born
	self.animate(); // Animate being born

	// BORN function
	var born = Sim.config.person.born;
	born(self);

	// Update
	self.update = function(){
		self.stage.during(self);
	};

	// Kill
	self.kill = function(){
		self.dead = true;
		self.graphics.animate(
			{opacity:0},
			Sim.ANIM_SPEED,
			mina.easeinout,
			function(){
				self.graphics.remove();
				//if(Focus.agent==self) Focus.removeFocus(); // Remove focus from self.
			}
		);
	}

	// GO TO STAGE
	self.goto = function(stageID){

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
		self.animate();

		// Do my new stage's welcome
		self.stage.welcome(self);

	};

	/***
	// Focus?
	self.isFocus = false;
	
	//FOR NOW, NAHHHH
	self.graphics.mousedown(function(){
		Focus.setFocus(self);
	});
	***/

}