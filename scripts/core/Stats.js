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
	var statConfig = config.getAttribute("stat");
	self.propertyObject = Sim.config.stats[statConfig];
	self.propertyName = "value";

	// What kind of editor?
	switch(self.propertyObject.type){
		case "percent": case "integer":
			EditorSlider(self,config);
			break;
	}

	// REPLACE DOM WHERE IT IS...
	config.parentNode.replaceChild(self.dom,config);

};

var EditorSlider = function(self,config){

	// Create DOM
	var dom = document.createElement("div");
	dom.setAttribute("class","edit_slider");
	self.dom = dom;

	// Create reset button
	var initialValue = self.propertyObject[self.propertyName];
	var color = config.parentNode.getAttribute("color");

	// Draw the arrow, scaled down.
	var svg = Snap(40,40);
	var p = svg.path(d="M19.7,36l8.7,5c-2.2,3.7-3.4,8-3.4,12.5c0,13.8,11.2,25,25,25s25-11.2,25-25c0-13.3-10.4-24.2-23.5-25c0,1,0,2,0,3v2.7  c0,2.2-1.6,3.1-3.5,2l-5.4-3.1c-1.9-1.1-5-2.9-6.9-4L30.3,26c-1.9-1.1-1.9-2.9,0-4l5.4-3.1c1.9-1.1,5-2.9,6.9-4l5.4-3  c1.9-1.1,3.5-0.3,3.5,1.8c0,1.4,0,3.2,0,4.8C70.1,19.3,85,34.7,85,53.5c0,19.3-15.7,35-35,35s-35-15.7-35-35  C15,47.1,16.7,41.2,19.7,36z");
	p.attr({fill:color});
	p.transform("s0.4,0.4,0,0");
	
	var resetButton = svg.node;
	resetButton.id = "reset";
	resetButton.onclick = function(){
		self.input.value = initialValue;
		oninput();
		resetButton.style.display = "none";
	};
	self.resetButton = resetButton;
	dom.appendChild(resetButton);

	// Create label text
	var labelConfig = config.getAttribute("label");
	var label = document.createElement("div");
	label.id = "label";
	label.innerHTML = labelConfig.replace(/\{.*\}/,"<span></span>");
	dom.appendChild(label);
	self.label = label;

	// What's min, max, and step?
	var type = self.propertyObject.type;
	var min,max,step;
	if(type=="percent"){
		min=0;
		max=1;
		step=0.01;
	}else if(type=="integer"){
		min=self.propertyObject.min;
		max=self.propertyObject.max;
		step=1;
	}

	// Create input slider
	var input = document.createElement("input");
	input.setAttribute("type", "range");
	input.setAttribute("min",min);
	input.setAttribute("max",max);
	input.setAttribute("step",step);
	dom.appendChild(input);
	self.input = input;

	// Set value to current value
	input.value = initialValue;

	// Update Label
	var labelSuffix = labelConfig.match(/\{(.*)\}/)[1];
	var span = label.querySelector("span");
	span.style.color = color;
	self.span = span;

	// What function, depending on the type
	var oninput;
	if(self.propertyObject.type=="percent"){
		oninput = function(){
			var hundred = Math.round(parseFloat(self.input.value)*100);
			self.span.innerHTML = hundred+labelSuffix;
			self.propertyObject[self.propertyName] = hundred/100;
		};
	}else if(self.propertyObject.type=="integer"){
		oninput = function(){
			var value = parseInt(self.input.value);
			self.span.innerHTML = value+labelSuffix;
			self.propertyObject[self.propertyName] = value;
		};
	}

	// Execute it once
	oninput();
	input.oninput = function(){
		resetButton.style.display = "block";
		oninput();
	};

};


})(window);