(function(exports){

// SINGLETON
var Sim = {};
exports.Sim = Sim;

// Initialize
Sim.config = null;
Sim.init = function(config){

	// Make a config
	Sim.config = config;

	// The people and stages
	Sim.people = [];
	Sim.stages = [];

	// The SVG containers
	Sim.model = Snap("#model");
	Sim.stagesSVG = Sim.model.group();
	Sim.peopleSVG = Sim.model.group();

	// Create Stages
	for(var stageID in Sim.config.stages){
		var stage = Sim.config.stages[stageID];
		Stages[stageID] = new Stage(stage);
	}

	// Focus
	// Focus.init(Sim.model);

	// Start the update loop
	setInterval(Sim.update, Sim.STEP_SPEED);

};

// Update
Sim.STEP_SPEED = 200;
Sim.ANIM_SPEED = Sim.STEP_SPEED*1.5;
Sim.update = function(){

	// Run the OBSERVER function
	var observe = Sim.config.observer.action;
	observe(Sim.people);

	// Update each person (they'll run their stage's during)
	for(var i=0;i<Sim.people.length;i++){
		Sim.people[i].update();
	}

	// Focus
	// Focus.update();

};

// Helper Functions
Sim.newPerson = function(stageID){
	var person = new Person(stageID);
	Sim.people.push(person);
};

})(window);