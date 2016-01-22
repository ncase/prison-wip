function Slider(config){

	var self = this;
	
	// The property we're editing
	self.propertyObject = PARAMS.CHANCES;
	self.propertyName = config.getAttribute("name");

	// Create DOM
	var dom = document.createElement("div");
	dom.setAttribute("class","slider");

	// Create text
	var label = document.createElement("div");
	label.innerHTML = config.getAttribute("label").replace("{%}","<span></span>");
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
	span.innerHTML = Math.round(parseFloat(input.value)*100)+"% chance";
	self.span = span;

	// On Input, edit the property
	input.oninput = function(){
		var hundred = Math.round(parseFloat(self.input.value)*100);
		self.span.innerHTML = hundred+"% chance";
		self.propertyObject[self.propertyName] = hundred/100;
	};

	// REPLACE DOM WHERE IT IS...
	config.parentNode.replaceChild(dom,config);

}

///////////////////////////////////////
// Helper to convert HTML to sliders //
///////////////////////////////////////

/***

<chance name="HIGH_TO_COLLEGE"/>
document.getElementsByTagName("chance")

***/

window.addEventListener("load",function(){

	var sliders = document.querySelectorAll("chance");
	for(var i=0;i<sliders.length;i++){
		var slider = sliders[i];
		new Slider(slider);
	}

},false);



