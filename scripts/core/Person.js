// Class
function Person(svg){

	var self = this;

	// Properties
	self.age = 0;
	self.excon = false;
	self.dead = false;

	// Box
	self.box = Box.getByName("BORN");

	// GRAPHICS
	var color = Snap.hsl(0, 0, 40+Math.random()*40);
	var body, eye1, eye2;
	self.graphics = svg.group(
		body=svg.circle(0,0,10).attr({fill:color}),
		eye1=svg.circle(-5,0,2).attr({fill:"#333"}),
		eye2=svg.circle(5,0,2).attr({fill:"#333"})
	);

	// TRANSFORM
	var _getRandomPositionInBox = function(box){
		var border = 15;
		var x = box.config.x + border;
		var y = box.config.y + border;
		var width = box.config.width - border*2;
		var height = box.config.height - border*2;
		return {
			x: x + Math.random()*width,
			y: y + Math.random()*height
		};
	};
	var pos = _getRandomPositionInBox(self.box);
	self.x = pos.x;
	self.y = pos.y;
	self.scale = 0;
	self.getMatrix = function(){
		var matrix = new Snap.Matrix();
		matrix.translate(self.x,self.y);
		matrix.scale(self.scale);
		return matrix;
	}
	self.graphics.transform(self.getMatrix());

	// UPDATE
	self.update = function(){};
	self.animate = function(callback){
		self.graphics.animate( {transform:self.getMatrix()}, ANIM_SPEED, mina.easeinout, callback);
		if(self.isFocus) Focus.animate();
	};
	self.kill = function(){
		self.graphics.animate( {opacity:0}, ANIM_SPEED, mina.easeinout, function(){
			self.graphics.remove();
			//if(Focus.agent==self) Focus.removeFocus(); // Remove focus from self.
		});
	}

	// GO TO BOX
	self.gotoBox = function(boxName,callback){

		// Find Box
		var box = Box.getByName(boxName);
		if(self.box==box) return;
		self.box = box;

		// GO THERE!
		var pos = _getRandomPositionInBox(self.box);
		self.x = pos.x;
		self.y = pos.y;
		self.animate(callback);

		// Record this in history
		// self.history.push({x:self.x, y:self.y});

	};

	// History
	// self.history = [{x:self.x, y:self.y}];

	// CONVICTED
	self.getConvicted = function(){
		body.attr({
			stroke: "#000",
        	strokeWidth: 2
        });
	};

	// (born anim)
	self.scale = 1;
	self.animate();

	// Focus?
	self.isFocus = false;
	
	//FOR NOW, NAHHHH
	self.graphics.mousedown(function(){
		Focus.setFocus(self);
	});
	

}

// Helpers
var agents = [];