(function(exports){

// Change Sim UI
exports.changeSimUI = function(){
	document.getElementById("sim_start").style.display = "none";
	document.getElementById("sim_ui").style.display = "block";
};

// Play & Pause
var play_pause = document.getElementById("play_pause");
play_pause.onclick = function(){
	Sim.isPlaying = !Sim.isPlaying;
	if(Sim.isPlaying) Sim.update();
	updatePlayPause();
};
var updatePlayPause = function(){
	play_pause.setAttribute("play",Sim.isPlaying);
};
updatePlayPause();
exports.updatePlayPause = updatePlayPause;

// Chart Class
function Chart(config){

	var self = this;
	self.svg = Snap(config.svg);
	self.stats = config.stats;

	// Graphics
	self.svg.attr({ fill:config.color });
	self.svg.rect(0, 0, 400, 16).attr({fill:"#eee"});
	var rect = self.svg.rect(0, 0, 0, 16);

	// Error Bar
	var error = self.svg.group().attr({fill:"#666"});
	var min = config.min*400;
	var max = config.max*400;
	error.rect(min,3,2,10);
	error.rect(max,3,2,10);
	error.rect(min,7,(max-min),2);

	// History
	self.history = [];

	// Update
	self.min = 1;
	self.max = 0;
	self.update = function(){

		// not yet
		if(Sim.people.length<100) return;

		// current ratio
		var ratio = self.stats();
		self.history.unshift(ratio);
		if(self.history.length>30) self.history.pop();

		// not yet either
		if(self.history.length<30) return;

		// do it
		var total = 0;
		for(var i=0;i<self.history.length;i++){
			total += self.history[i];
		}
		var avg = total/self.history.length;
		var point = avg;
		rect.animate({width:point*400}, Sim.STEP_SPEED, mina.easeinout);

		// FOR DEBUGGING: record chart history
		if(self.max<point) self.max=point;
		if(self.min>point) self.min=point;

	};
	setInterval(self.update, Sim.STEP_SPEED);

}

// Charts
exports.chart1 = new Chart({
	color: "#000",
	min:0.09, max:0.16,
	svg: document.querySelector("#stat_incarceration > svg"),
	stats: function(){
		var count = 0;
		for(var i=0;i<Sim.people.length;i++){
			if(Sim.people[i].stageID=="prison") count++;
		}
		return count/Sim.people.length;
	}
});

/*exports.chart2 = new Chart({
	color: "#88aa22",
	min:0.22, max:0.28,
	// min:0.30, max:0.39, -- INCLUDING PRISONERS
	svg: document.querySelector("#stat_unemployment > svg"),
	stats: function(){
		var unemployed = 0;
		var employed = 0;
		for(var i=0;i<Sim.people.length;i++){
			var stage = Sim.people[i].stageID;
			if(stage=="unemployed") unemployed++;
			// if(stage=="prison") unemployed++;
			if(stage=="employed") employed++;
		}
		if(unemployed+employed==0) return 1;
		return unemployed/(unemployed+employed);
	}
});*/

exports.chart2 = new Chart({
	color: "#b1e21d",
	min:0.52, max:0.62,
	svg: document.querySelector("#stat_unemployment > svg"),
	stats: function(){
		var count = 0;
		for(var i=0;i<Sim.people.length;i++){
			if(Sim.people[i].stageID=="employed") count++;
		}
		return count/Sim.people.length;
	}
});

exports.chart3 = new Chart({
	color: "#1da0e2",
	min:0.07, max:0.26,
	svg: document.querySelector("#stat_college > svg"),
	stats: function(){
		var degree = 0;
		var adults = 0;
		for(var i=0;i<Sim.people.length;i++){
			var p = Sim.people[i];
			if(p.age>=22) adults++;
			if(p.education>=STATS("edu_for_college_cert")) degree++;
		}
		if(adults==0) return 0;
		return degree/adults;
	}
});

})(window);