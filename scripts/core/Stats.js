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

	// Create text
	var labelConfig = config.getAttribute("label");
	var label = document.createElement("div");
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
	input.value = self.propertyObject[self.propertyName];

	// Update Label
	var labelSuffix = labelConfig.match(/\{(.*)\}/)[1];
	var span = label.querySelector("span");
	span.style.color = config.parentNode.getAttribute("color");
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
	input.oninput = oninput;

};


})(window);