// Model
var model = Snap("#model");
var boxesSVG = model.group();
var agentsSVG = model.group();

// Focus
Focus.init(model);

// Update Loop
function update(){

	// Make new baby agent
	var newAgent = new Agent(agentsSVG);
	agents.push(newAgent);

	// For each agent...
	for(var i=0;i<agents.length;i++){
		var agent = agents[i];
		var killAgent = updateAgent(agent);
		if(killAgent){
			agents.splice(i,1);
			i--;
		}
	}

	// Focus
	Focus.update();

}

var STEP_SPEED = 200;
var ANIM_SPEED = STEP_SPEED*1.5;

setInterval(function(){
	//stats.begin();
	update();
	//stats.end();
},STEP_SPEED);

// STATS.JS
/*var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'fixed';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
*/