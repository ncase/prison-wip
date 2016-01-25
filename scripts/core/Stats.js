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


})(window);