/********

Boxes act ON agents? // data would be easier for this.
Agents act IN boxes?
An external logic class handles both?
A mix of the above???

BOXES:
- BABIES
- K-12 SCHOOL
- COLLEGE
- UNEMPLOYED
- EMPLOYED
- PRISON

********/

// Model
var model = Snap("#model");

// Box
boxes.push(new Box(model,{

	name:"PRISON",
	x:50, y:50,
	width: 200,
	height:200,
	color:"#cc2727"

}));
boxes.push(new Box(model,{

	name:"SCHOOL",
	x:50, y:300,
	width: 200,
	height:200,
	color:"#bada55"

}));

// Agents
var agents = [];
for(var i=0;i<100;i++){
	var agent = new Agent(model);
	agents.push(agent);
}

// Update Loop
setInterval(function(){
	stats.begin();
	for(var i=0;i<agents.length;i++){
		agents[i].update();
	}
	stats.end();
},1000/30);

// STATS.JS
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
