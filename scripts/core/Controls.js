(function(exports){

// Play & Pause
var play_pause = document.getElementById("play_pause");
play_pause.onclick = function(){
	Sim.isPlaying = !Sim.isPlaying;
	if(Sim.isPlaying) Sim.update();
	updatePlayPause();
};
var updatePlayPause = function(){
	play_pause.innerHTML = (Sim.isPlaying ? "pause" : "play");
};
updatePlayPause();


// Stats
var statsHistory = {
	prison: [],
	unemployment: [],
	college: []
};
var _getAverage = function(array){
	var total = 0;
	for(var i=0;i<array.length;i++){
		total += array[i];
	}
	return total/array.length;
};
var stat_incarceration = document.getElementById("stat_incarceration");
var stat_unemployment = document.getElementById("stat_unemployment");
var stat_college = document.getElementById("stat_college");
var statsUpdate = function(){

	// What ratio of all people are in prison?
	var count = 0;
	for(var i=0;i<Sim.people.length;i++){
		if(Sim.people[i].stageID=="prison") count++;
	}
	var prison = count/Sim.people.length;

	// What ratio of everyone in the labor force is unemployed?
	var unemployed = 0;
	var employed = 0;
	for(var i=0;i<Sim.people.length;i++){
		var stage = Sim.people[i].stageID;
		if(stage=="unemployed") unemployed++;
		if(stage=="employed") employed++;
	}
	var unemployment = unemployed/(unemployed+employed);

	// What ratio of people age 22+ have a college degree?
	var degree = 0;
	var adults = 0;
	for(var i=0;i<Sim.people.length;i++){
		var p = Sim.people[i];
		if(p.age>=22) adults++;
		if(p.education>=STATS("edu_for_college_cert")) degree++;
	}
	var college = degree/adults;

	////////////////////////////////////
	////////////////////////////////////
	////////////////////////////////////

	statsHistory.prison.unshift(prison);
	statsHistory.unemployment.unshift(unemployment);
	statsHistory.college.unshift(college);

	if(statsHistory.prison.length>20) statsHistory.prison.pop();
	if(statsHistory.unemployment.length>20) statsHistory.unemployment.pop();
	if(statsHistory.college.length>20) statsHistory.college.pop();

	prison = _getAverage(statsHistory.prison);
	unemployment = _getAverage(statsHistory.unemployment);
	college = _getAverage(statsHistory.college);

	////////////////////////////////////
	////////////////////////////////////
	////////////////////////////////////

	//stat_incarceration.innerHTML = "incarceration rate: "+Math.round(100*prison)+"%";
	//stat_unemployment.innerHTML = "unemployment rate: "+Math.round(100*unemployment)+"%";
	//stat_college.innerHTML = "adults w/ degrees: "+Math.round(100*college)+"%";

};
setInterval(statsUpdate, Sim.STEP_SPEED);

})(window);