// Class
var Stages = {};
function Stage(config){

	var self = this;
	self.layout = config.box;

	// Graphics
	var layout = self.layout;
	var svg = Sim.stagesSVG;
	var box = svg.rect(layout.x, layout.y, layout.width, layout.height).attr({
		stroke: layout.color,
		strokeWidth: 5,
		fill: 'none'
	});
	var label = svg.text(layout.x,layout.y,layout.label).attr({
		"font-size": 25,
		dx: "-3px",
		dy: "-8px",
		fill: layout.color,
		fontWeight: 'normal'		
	});
	self.graphics = svg.group(box,label);

	// Functions
	self.welcome = config.welcome || function(){};
	self.during = config.during || function(){};
	self.goodbye = config.goodbye || function(){};

}