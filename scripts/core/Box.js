// Class
function Box(model,config){

	var self = this;
	self.config = config;
	self.name = config.name;

	// GRAPHICS
	self.graphics = model.rect(config.x, config.y, config.width, config.height)
						 .attr({stroke:config.color, strokeWidth:10, fill:'none'});

	// UPDATE
	self.update = function(){
	};

}

// Helpers
var boxes = [];
Box.getByName = function(name){
	for(var i=0;i<boxes.length;i++){
		var box = boxes[i];
		if(box.name==name) return box;
	}
	return null;
};