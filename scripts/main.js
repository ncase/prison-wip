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
				label: "BORN",
				x:10, y:35, width:200, height:120,
				color: Snap.hsl(200,57,30)
			},
			during: function(person){
				if(person.age >= STATS("age_for_school")){
					return person.goto("k-12");
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
		"k-12":{
			box:{
				label: "K-12",
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

				// If you graduate, maybe college, or job! (or not)
				if(person.education >= STATS("edu_for_high_school_cert")){
					if(CHANCE("high_school_to_college")){
						return person.goto("college");
					}else if(CHANCE("high_school_to_job")){
						return person.goto("employed");
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

				// If you graduate, maybe job! (or not)
				if(person.education >= STATS("edu_for_college_cert")){
					if(CHANCE("college_to_job")){
						return person.goto("employed");
					}else{
						return person.goto("unemployed");
					}
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

				// Never incarcerated before
				if(person.convictions==0){
					if(CHANCE("unemployed_gets_employed")){
						return person.goto("employed");
					}
					if(CHANCE("unemployed_gets_convicted")){
						return person.goto("prison");
					}
				}
				
				// Excon
				if(person.convictions>0){
					if(CHANCE("excon_gets_employed")){
						return person.goto("employed");
					}
					if(CHANCE("excon_gets_convicted")){
						return person.goto("prison");
					}
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
				label: "JAIL / PRISON",
				x:10, y:350, width:620, height:120,
				color:"#000"
			},
			welcome: function(person){

				// New conviction
				person.convictions++;
				person.yearsInPrisonLeft = STATS("prison_sentence");

				// If the Three Strikes rule's in place,
				// you get LIFE on your third conviction
				if(STATS("three_strikes")){
					if(person.convictions>=3){
						person.yearsInPrisonLeft = 1000;
					}
				}

			},
			during: function(person){
				person.prisonYearsLeft--;
				if(person.prisonYearsLeft==0){
					return person.goto("UNEMPLOYED");
				}
			},
			goodbye: function(person){
				person.excon = true;
			}
		}
	},

	/*********
	BASED OFF REAL STATISTICS:
	with initial value, and what the edit controls are like
	(slider, boolean, or just do NOT allow editing)
	*********/
	stats:{

		// Some un-editable constants
		"age_for_school":{ value:6 },
		"age_for_death":{ value:78 },
		"edu_for_high_school_cert":{ value:12 },
		"edu_for_college_cert":{ value:16 },

		// Grade/High School Stats
		"high_school_dropout":{ // per year
			value: 0.10
		},
		"high_school_convicted":{ // per year
			value: 0.02
		},
		"high_school_to_college":{ // on graduation
			value: 0.3
		},
		"high_school_to_job":{ // on graduation
			value: 0.3
		},

		// College Stats
		"college_dropout":{ // per year
			value: 0.10
		},
		"college_convicted":{ // per year
			value: 0.02
		},
		"college_to_job":{ // on graduation
			value: 0.9
		},

		// Unemployed Stats (all Per Year)
		"unemployed_gets_employed":{
			value: 0.30
		},
		"unemployed_gets_convicted":{
			value: 0.10
		},
		"excon_gets_employed":{
			value: 0.05
		},
		"excon_gets_convicted":{
			value: 0.50
		},

		// Employed Stats (all Per Year)
		"employed_convicted":{
			value: 0.05
		},
		"laid_off":{
			value: 0.20
		},

		// Prison Stats (all upon entering)
		"prison_sentence":{
			value: 10
		},
		"three_strikes":{
			value: true
		},

	},

	/*********
	"THE OBSERVER":
	does something to ALL people at once.
	controls people's births & deaths.
	*********/
	observer:{
		action: function(people){

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

			// Every year, a new person is born (added to the "born" stage)
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

			// Start from zero for everything
			person.age = 0;
			person.education = 0;
			person.convictions = 0;

		},
		drawInitialize: function(person){
		},
		drawUpdate: function(person){
		}
	}

	/*********
	GRAPHS: (????)
	To visually show & analyze stats.
	(how to compare to Controlled Sim???)
	*********/
	graphs:{}

});