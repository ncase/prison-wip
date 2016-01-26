(function(exports){

// Just gets the value
exports.STATS = function(statID){
	var stat = Sim.config.stats[statID];
	return stat.value;
};

// Gets value, then does a Math.random() for chance
exports.CHANCE = function(statID){
	var probability = STATS(statID);
	return(Math.random()<probability);
};

///////////////////////////////////////////////////////
// And then, there's all the code to turn the HTML tags
// into actual editor UI
///////////////////////////////////////////////////////

window.addEventListener("load",function(){

	// For each edit container, style its color
	var containers = document.querySelectorAll(".edit_container");
	for(var i=0;i<containers.length;i++){
		var container = containers[i];
		container.style.borderColor = container.getAttribute("color");
	}

	// For each edit element
	var elements = document.querySelectorAll(".edit_container edit");
	for(var i=0;i<elements.length;i++){
		var element = elements[i];
		new Editor(element);
	}

},false);

var Editor = function(config){

	var self = this;
	
	// The property we're editing
	self.propertyObject = Sim.config.stats[config.getAttribute("stat")];
	self.propertyName = "value";

	// Create DOM
	var dom = document.createElement("div");
	dom.setAttribute("class","edit_slider");

	// Create text
	var label = document.createElement("div");
	label.innerHTML = config.getAttribute("label").replace("{value}","<span></span>");
	dom.appendChild(label);
	self.label = label;

	// Create input slider
	var input = document.createElement("input");
	input.setAttribute("type", "range");
	input.setAttribute("min",0);
	input.setAttribute("max",1);
	input.setAttribute("step",0.01);
	dom.appendChild(input);
	self.input = input;

	// Set value to current value
	input.value = self.propertyObject[self.propertyName];

	// Update Label
	var span = label.querySelector("span");
	span.innerHTML = Math.round(parseFloat(input.value)*100)+"%";
	span.style.color = config.parentNode.getAttribute("color");
	self.span = span;

	// On Input, edit the property
	input.oninput = function(){
		var hundred = Math.round(parseFloat(self.input.value)*100);
		self.span.innerHTML = hundred+"%";
		self.propertyObject[self.propertyName] = hundred/100;
	};

	// REPLACE DOM WHERE IT IS...
	config.parentNode.replaceChild(dom,config);

};


})(window);