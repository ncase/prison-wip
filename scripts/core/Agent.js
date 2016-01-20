// Class
function Agent(model){

	var self = this;

	// GRAPHICS
	var color = Snap.hsl(0, 0, 40+Math.random()*40);
	self.graphics = model.group(
		model.circle(0,0,10).attr({fill:color}),
		model.circle(-5,0,2).attr({fill:"#333"}),
		model.circle(5,0,2).attr({fill:"#333"})
	);

	// TRANSFORM
	self.x = 50+Math.random()*450;
	self.y = 300+Math.random()*200;
	self.scale = 0;
	self.getMatrix = function(){
		var matrix = new Snap.Matrix();
		matrix.translate(self.x,self.y);
		matrix.scale(self.scale);
		return matrix;
	}
	self.graphics.transform(self.getMatrix());

	// UPDATE
	self.update = function(){
		if(Math.random()<0.005){
			self.gotoBox("PRISON");
		}
		if(Math.random()<0.015){
			self.gotoBox("SCHOOL");
		}
	};
	self.animate = function(){
		self.graphics.animate( {transform:self.getMatrix()}, 500, mina.easeinout);
		if(self.isFocus) Focus.animate();
	};

	// GO TO BOX
	self.gotoBox = function(boxName){

		// Find Box
		var box = Box.getByName(boxName);

		// Get Box dimensions, minus own arbitrary radius
		var border = 15;
		var x = box.config.x + border;
		var y = box.config.y + border;
		var width = box.config.width - border*2;
		var height = box.config.height - border*2;

		// GO THERE!
		self.x = x + Math.random()*width;
		self.y = y + Math.random()*height;
		self.animate();

	};

	// (born anim)
	self.scale = 1;
	self.animate();

	// Focus?
	self.isFocus = false;
	self.graphics.mousedown(function(){
		Focus.setFocus(self);
	});

}