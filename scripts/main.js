Sim.init({

	/*********
	THE STAGES OF A PERSON'S LIFE:
	what happens in them, also, the layout of the stage-boxes.
	*********/
	stages:{

		/*********
		Welcome to the world, baby.
		After a few years of doing nothing, you go to school.
		*********/
		"born":{
			box:{
				label: "NEW KIDS",
				x:10, y:35, width:200, height:120,
				color: Snap.hsl(200,57,30)
			},
			during: function(person){
				if(person.age >= STATS("age_for_school")){
					return person.goto("high");
				}
			}
		},

		/*********
		When you're in school, there's a chance
		you'll drop out, or get in trouble with the law.
		If you make it to the end of high school, though,
		you'll get a high school certificate! And you
		may go to college! Or not.
		*********/
		"high":{
			box:{
				label: "HIGH SCHOOL",
				x:220, y:35, width:200, height:120,
				color: Snap.hsl(200,67,40)
			},
			during: function(person){

				// Chance you'll drop out
				if(CHANCE("high_school_dropout")){
					return person.goto("unemployed");
				}

				// Chance you'll get convicted
				if(CHANCE("high_school_convicted")){
					return person.goto("prison");
				}

				// Get educated on.
				person.education++;

				// If you graduate, maybe college! (or not)
				if(person.education >= STATS("edu_for_high_school_cert")){
					if(CHANCE("high_school_to_college")){
						return person.goto("college");
					}else{
						return person.goto("unemployed");
					}
				}

			}
		},

		/*********
		There's also a chance, in college, that you'll
		drop out. Otherwise, you'll get another
		certificate! And from there, you may or
		may not get a job straight outta college.
		*********/
		"college":{
			box:{
				label: "COLLEGE",
				x:430, y:35, width:200, height:120,
				color: Snap.hsl(200,77,50)
			},
			during: function(person){

				// Chance you'll drop out
				if(CHANCE("college_dropout")){
					return person.goto("unemployed");
				}

				// Chance you'll get convicted
				if(CHANCE("college_convicted")){
					return person.goto("prison");
				}

				// Get educated on.
				person.education++;

				// Graduate, go to the job market
				if(person.education >= STATS("edu_for_college_cert")){
					return person.goto("unemployed");
				}

			}
		},

		/*********
		There's a slightly higher chance that,
		if you're unemployed, you might commit
		a crime. Or, depending on your education
		and past convict status, you may/may not
		get a job!
		*********/
		"unemployed":{
			box:{
				label: "UNEMPLOYED",
				x:10, y:193, width:305, height:120,
				color: Snap.hsl(75,67,40)
			},
			during: function(person){

				////////////////
				// EMPLOYMENT //
				////////////////

				// Base Rates, based on education.
				var chance_i_get_employed;
				if(person.education<4){
					chance_i_get_employed = STATS("employment_degree_none");
				}else if(person.education==4){
					chance_i_get_employed = STATS("employment_degree_high");
				}else if(person.education<8){
					chance_i_get_employed = STATS("employment_degree_some_college");
				}else{
					chance_i_get_employed = STATS("employment_degree_bachelor");
				}

				// Am I an excon?
				if(person.convictions>0){
					chance_i_get_employed *= (1-STATS("excon_factor_employed")); // *=, coz it's a *relative* cost
				}

				// Apply
				if(Math.random() < chance_i_get_employed){
					return person.goto("employed");
				}

				////////////////
				// CONVICTION //
				////////////////

				// Base rate
				var chance_i_get_convicted = STATS("unemployed_gets_convicted");
				
				// Am I an excon?
				if(person.convictions>0){
					chance_i_get_convicted = STATS("excon_gets_convicted");
				}

				// Apply
				if(Math.random() < chance_i_get_convicted){
					return person.goto("prison");
				}

			}
		},

		/*********
		Hurray, you are gainfully employed.
		A chance you may get laid off, though,
		probably of no fault of your own.
		It's this economy, yo.
		*********/
		"employed":{
			box:{
				label: "EMPLOYED",
				x:325, y:193, width:305, height:120,
				color: Snap.hsl(75,77,50)
			},
			during: function(person){

				// Chance you go to prison
				if(CHANCE("employed_convicted")){
					return person.goto("prison");
				}

				// Chance you get laid off
				if(CHANCE("laid_off")){
					return person.goto("unemployed");
				}

			}
		},

		/*********
		Well, this frikkin' sucks.
		When you get into prison, your prison sentence
		is determined based on past crimes.
		(Simulate Clinton's Three Strikes rule???)
		And when you get out, you're given
		an ex-con status. (+ one new "strike"?)
		*********/
		"prison":{
			box:{
				label: "INCARCERATED",
				x:10, y:350, width:620, height:120,
				color:"#000"
			},
			welcome: function(person){
				person.convictions++;
				person.yearsInPrisonLeft = STATS("prison_sentence");
			},
			during: function(person){

				// Sentence decreases til you're out
				person.yearsInPrisonLeft--;
				if(person.yearsInPrisonLeft<=0){
					return person.goto("unemployed");
				}

			}
		}
	},

	/*********
	BASED OFF REAL STATISTICS:
	with initial value, and what the edit controls are like
	(slider, boolean, or just do NOT allow editing)
	*********/
	stats:{

		// Meta
		"sim_start":{ value:false },

		// Some un-editable constants
		"age_for_school":{ value:13 },
		"age_for_death":{ value:78 },
		"edu_for_high_school_cert":{ value:4 }, // 4 years in high school
		"edu_for_college_cert":{ value:8 }, // plus 4 years for college

		////////////////////////////
		///// HIGH SCHOOL STATS ////
		////////////////////////////

		// National Center for Education Statistics
		// https://nces.ed.gov/pubs2012/2012006.pdf
		// For low-income groups, it's 7% a year.
		"high_school_dropout":{ // per year
			type: "percent",
			value: 0.07
		},

		// FBI's stats
		// for males 13-17 it's average 3,400 outta 100,000
		// but that's for all income levels, can't find anything specific to low-income
		// https://www.fbi.gov/about-us/cjis/ucr/additional-ucr-publications/age_race_arrest93-01.pdf
		"high_school_convicted":{ // per year
			type: "percent",
			value: 0.03
		},

		// National Center for Education Statistics
		// http://nces.ed.gov/programs/coe/indicator_cpa.asp
		// For low-income groups, it's 50% enrollment. (huh, higher than I thought)
		"high_school_to_college":{ // on graduation
			type: "percent",
			value: 0.49
		},

		////////////////////////////
		/////// COLLEGE STATS //////
		////////////////////////////

		// National Center for Education Statistics
		// https://nces.ed.gov/fastfacts/display.asp?id=40
		// 0.59 of students finish a four year course,
		// meaning for each year, 0.87 of students finish it
		// since 0.87*0.87*0.87*0.87 ~= 0.59
		// therefore, 1.00-0.87 = 0.13 of students drop out a year
		// Again, not for low-income groups, which is probably higher
		"college_dropout":{ // per year
			type: "percent",
			value: 0.13
		},

		// FBI's stats again
		// for males 18-22 it's average 3,900 outta 100,000
		// https://www.fbi.gov/about-us/cjis/ucr/additional-ucr-publications/age_race_arrest93-01.pdf
		"college_convicted":{ // per year
			type: "percent",
			value: 0.04
		},

		////////////////////////////
		///// EMPLOYMENT STATS /////
		////////////////////////////

		// National Center for Education Statistics
		// HEAVILY depends on degree
		// https://nces.ed.gov/fastfacts/display.asp?id=561
		// https://nces.ed.gov/programs/digest/d14/tables/dt14_501.50.asp
		"employment_degree_none":{
			type: "percent",
			value: 0.55
		},
		"employment_degree_high":{
			type: "percent",
			value: 0.67
		},
		"employment_degree_some_college":{
			type: "percent",
			value: 0.73
		},
		"employment_degree_bachelor":{
			type: "percent",
			value: 0.82
		},

		// The Center for Economic and Policy Research
		// https://web.archive.org/web/20150215035929/http://www.cepr.net/documents/publications/ex-offenders-2010-11.pdf
		"excon_factor_employed":{
			type: "percent",
			value: 0.12
		},

		// ???
		// Depends on age.
		"unemployed_gets_convicted":{
			type: "percent",
			value: 0.10
		},

		// Bureau of Justice Statistics (.gov)
		// http://www.bjs.gov/content/pub/pdf/rprts05p0510.pdf
		"excon_gets_convicted":{
			type: "percent",
			value: 0.57
		},

		// Employed Stats (all Per Year)
		// WHAT ABOUT SOCIAL MOBILITY??? //
		// and GETTING OUTTA THIS SYSTEM //
		"employed_convicted":{
			type: "percent",
			value: 0.05
		},

		// ???
		"laid_off":{
			type: "percent",
			value: 0.10
		},

		///////////////////////////
		/////// PRISON STATS //////
		///////////////////////////

		// ???
		"prison_sentence":{ // upon entering
			type: "integer",
			min:1, max:50,
			value: 10
		}

	},

	/*********
	"THE OBSERVER":
	does something to ALL people at once.
	controls people's births & deaths.
	*********/
	observer:{
		welcome: function(people){
			// Start with three kids.
			for(var i=0;i<3;i++) Sim.newPerson("born");
		},
		action: function(people){

			// If the sim's started...
			if(!STATS("sim_start")) return;

			// For every person...
			for(var i=0;i<people.length;i++){
				var person = people[i];

				// Age them all by one year
				person.age++;

				// If too old, kill 'em off
				if(person.age > STATS("age_for_death")){
					person.kill();
				}

			}

			// Every year, one new person is created
			Sim.newPerson("born");

		}
	},

	/*********
	AN INDIVIDUAL PERSON:
	what stats they start with,
	and how to draw them in the beginning and each year
	*********/
	person:{
		born: function(person){

			// Let's start at puberty.
			person.age = 11;

			// Start from zero for everything else
			person.education = 0;
			person.convictions = 0;

		},
		drawInitialize: function(person){

			var g = person.graphics;

			// Whatever shade of skin
			var skin = Snap.hsl(0, 0, 40+Math.random()*40);
			person.body = g.circle(0,0,10).attr({fill:skin});

			// My ALIVE eyes
			person.aliveEyes = g.group(
				g.circle(-5,0,2),
				g.circle(5,0,2)
			).attr({
				fill:"#222"
			});

			// My DEAD eyes
			person.deadEyes = g.group(
				g.line(5-2,-2,5+2,2),
				g.line(5-2,2,5+2,-2),
				g.line(-5-2,-2,-5+2,2),
				g.line(-5-2,2,-5+2,-2)
			).attr({
				display:"none",
				stroke: "#222",
	        	strokeWidth: 1
			});

			// My degree
			person.degree = g.rect(4,4,6,6).attr({
				display:"none",
				stroke: "#ccc",
	        	strokeWidth: 1
			});

		},
		drawUpdate: function(person){

			// If you've been convicted, black border
			if(person.convictions>0){
				person.body.attr({
					stroke: "#222",
	        		strokeWidth: 2
				});
			}

			// If you have a degree, show it
			if(person.education >= STATS("edu_for_high_school_cert")){
				person.degree.attr({display:"block"});

				// Bachelor's or higher
				if(person.education >= STATS("edu_for_college_cert")){

					person.degree.attr({
						fill:"#FFD700",
						stroke:"#DAA520"
					});

				// Some college
				//}else if(person.education > STATS("edu_for_high_school_cert")){

				// Just high school
				}else{
					person.degree.attr({fill:"#FFF"}); // high school diploma
				}
			}

			// If you're dead, show the X eyes.
			if(person.dead){
				person.aliveEyes.attr({display:"none"});
				person.deadEyes.attr({display:""});
			}

		}
	},

	/*********
	GRAPHS: (????)
	To visually show & analyze stats.
	(how to compare to Controlled Sim???)
	*********/
	graphs:{}

});