var PARAMS = {

	CHANCES:{

		HIGH_TO_COLLEGE: 0.3,
		HIGH_TO_JOB: 0.5,
		HIGH_TO_PRISON: 0.01,

		COLLEGE_TO_JOB: 0.9,
		JOB_LAID_OFF: 0.5,

		NOJOB_TO_JOB: 0.1,
		NOJOB_TO_PRISON: 0.05,
		NOJOB_TO_JOB_EXCON: 0.00,
		NOJOB_TO_PRISON_EXCON: 0.1

	},

	AGES:{
		SCHOOL: 6,
		HIGH_GRAD: 18,
		COLLEGE_GRAD: 22,
		DEATH: 80
	},

	YEARS:{
		PRISON:25
	}

};

///////////////////////
///// AGENT LOGIC /////
///////////////////////

function updateAgent(agent){

	var box = agent.box.name;

	// Increase your age
	agent.age++;

	// Are you 80? DIE
	if(agent.age==PARAMS.AGES.DEATH){
		agent.kill();
		agent.dead = true;
		return true;
	}

	// BORN! Go to K-12 when you're age 6.
	if(box=="BORN"){
		if(agent.age>=PARAMS.AGES.SCHOOL){
			agent.gotoBox("K-12");
			return;
		}
	}

	// K-12! When you graduate (age 18), 30% chance of going to college.
	// If not college, 20% chance of right to the workplace, otherwise unemployed
	// Also, a chance you'll go straight to prison
	if(box=="K-12"){
		if(agent.age>=PARAMS.AGES.HIGH_GRAD){
			if(Math.random()<PARAMS.CHANCES.HIGH_TO_COLLEGE){
				agent.gotoBox("COLLEGE");
			}else{
				if(Math.random()<PARAMS.CHANCES.HIGH_TO_JOB){
					agent.gotoBox("EMPLOYED");
				}else{
					agent.gotoBox("UNEMPLOYED");
				}
			}
			return;
		}
		if(Math.random()<PARAMS.CHANCES.HIGH_TO_PRISON){
			_convictAgent(agent);
			return;
		}
	}

	// COLLEGE! When you graduate (age 22), 80% chance of getting work, otherwise unemployed
	if(box=="COLLEGE"){
		if(agent.age>=PARAMS.AGES.COLLEGE_GRAD){
			if(Math.random()<PARAMS.AGES.COLLEGE_TO_JOB){
				agent.gotoBox("EMPLOYED");
			}else{
				agent.gotoBox("UNEMPLOYED");
			}
			return;
		}
	}

	// UNEMPLOYED! A chance of getting employed each year. A chance of going to prison.
	// Changes depending on if you're an excon (flipped around the chances)
	if(box=="UNEMPLOYED"){
		if(agent.excon){
			if(Math.random()<PARAMS.CHANCES.NOJOB_TO_JOB_EXCON){
				agent.gotoBox("EMPLOYED");
				return;
			}
			if(Math.random()<PARAMS.CHANCES.NOJOB_TO_PRISON_EXCON){
				_convictAgent(agent);
				return;
			}
		}else{
			if(Math.random()<PARAMS.CHANCES.NOJOB_TO_JOB){
				agent.gotoBox("EMPLOYED");
				return;
			}
			if(Math.random()<PARAMS.CHANCES.NOJOB_TO_PRISON){
				_convictAgent(agent);
				return;
			}
		}
	}

	// EMPLOYED! A chance of getting laid off.
	if(box=="EMPLOYED"){
		if(Math.random()<PARAMS.CHANCES.JOB_LAID_OFF){
			agent.gotoBox("UNEMPLOYED");
			return;
		}
	}

	// PRISON! After serving your time, get back out to unemployed. (but with bad mark)
	if(box=="PRISON"){
		agent.prisonYearsLeft--;
		if(agent.prisonYearsLeft==0){
			agent.gotoBox("UNEMPLOYED");
		}
	}

}

function _convictAgent(agent){
	agent.excon = true;
	agent.prisonYearsLeft = PARAMS.YEARS.PRISON;
	agent.gotoBox("PRISON",function(){
		agent.getConvicted();
	});
}

/////////////////
///// BOXES /////
/////////////////

boxes.push(new Box(boxesSVG,{

	name:"BORN",
	label:"BORN",
	x:10, y:35,
	width: 200,
	height: 120,
	color: Snap.hsl(200,57,30)

}));
boxes.push(new Box(boxesSVG,{

	name:"K-12",
	label:"K-12",
	x:220, y:35,
	width: 200,
	height: 120,
	color: Snap.hsl(200,67,40)

}));
boxes.push(new Box(boxesSVG,{

	name:"COLLEGE",
	label:"COLLEGE",
	x:430, y:35,
	width: 200,
	height: 120,
	color: Snap.hsl(200,77,50)

}));
boxes.push(new Box(boxesSVG,{

	name:"UNEMPLOYED",
	label:"UNEMPLOYED",
	x:10, y:193,
	width: 305,
	height: 120,
	color: Snap.hsl(75,67,40)

}));
boxes.push(new Box(boxesSVG,{

	name:"EMPLOYED",
	label:"EMPLOYED",
	x:325, y:193,
	width: 305,
	height: 120,
	color: Snap.hsl(75,77,50)

}));
boxes.push(new Box(boxesSVG,{

	name:"PRISON",
	label:"JAIL / PRISON",
	x:10, y:350,
	width: 620,
	height: 120,
	color:"#000"

}));