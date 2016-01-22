// Class
function Box(svg,config){

	var self = this;
	self.config = config;
	self.name = config.name;

	// GRAPHICS
	var box = svg.rect(config.x, config.y, config.width, config.height).attr({
		stroke: config.color,
		strokeWidth: 5,
		fill: 'none'
	});
	var label = svg.text(config.x,config.y,config.label).attr({
		"font-size": 25,
		dx: "-3px",
		dy: "-8px",
		fill: config.color,
		fontWeight: 'normal'		
	});
	self.graphics = svg.group(box,label);

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