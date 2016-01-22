(function(){

	window.Focus = {};

	// GRAPHICS
	Focus.init = function(svg){

		// CREATE IRIS MASK
		var shadeRect = svg.rect(-1000,-1000,2000,2000).attr({ fill:"rgba(0,0,0,0.5)" });
		//var radialGradient = svg.gradient("r(0.5,0.5,1)#000-#fff");
		var maskCircle = svg.circle(0,0,25).attr({ fill:"#000" });
		var maskRect = svg.rect(-1000,-1000,2000,2000).attr({ fill:"#fff" });
		var group = svg.group(maskRect,maskCircle);
		shadeRect.attr({ mask:group });
		Focus.shade = shadeRect;

		// Text
		Focus.label = svg.text(0,0,"").attr({
			"font-size": 16,
			dy: "-30px",
			fill: "#fff",
			"text-anchor":"middle",
			fontWeight: '100'
		});

		// Path
		/*Focus.path = svg.path("").attr({
			fill: "none",
			stroke: "#cc2727",
			strokeWidth: 2
		})*/

		// The whole graphics
		Focus.graphics = svg.group(Focus.shade,Focus.label);
		Focus.graphics.attr({display:"none"});

		// When you click that element, tho...
		Focus.graphics.mousedown(Focus.removeFocus);

	};

	// Set Focus
	Focus.agent = null;
	Focus.setFocus = function(agent){

		// Tell the previous agent job's over
		if(Focus.agent){
			Focus.agent.isFocus = false;
		}

		// Set as agent
		Focus.agent = agent;
		Focus.agent.isFocus = true;

		// Push graphic to position
		var matrix = new Snap.Matrix();
		matrix.translate(Focus.agent.x,Focus.agent.y);
		Focus.graphics.transform(matrix);

		// Show it!
		Focus.graphics.attr({display:""});

		// Also, push agent's graphic to the front.
		var agentG = Focus.agent.graphics;
		var parent = agentG.parent();
		agentG.remove();
		parent.append(agentG);

		// UPDATE NOW
		Focus.update();

	};

	// Animate
	Focus.animate = function(){

		// If none, naw
		if(!Focus.agent) return;

		// Get position, animate to it.
		var matrix = new Snap.Matrix();
		matrix.translate(Focus.agent.x,Focus.agent.y);
		
		// Anim
		Focus.graphics.animate({transform:matrix}, ANIM_SPEED, mina.easeinout);

	};

	// Un-focus
	Focus.removeFocus = function(){

		// Job's over, agent.
		Focus.agent.isFocus = false;
		Focus.agent = null;

		// Hide
		Focus.graphics.attr({display:"none"});
		
	};

	// Update
	Focus.update = function(){

		// If none, naw
		if(!Focus.agent) return;
		var a = Focus.agent;

		// Label!
		var labelText = a.dead ? "R.I.P" : "age "+a.age;
		Focus.label.attr({text:labelText});

		// Path
		/*var path = "";
		var pt = a.history[0];
		path+="M"+Math.round(pt.x)+","+Math.round(pt.y);
		for(var i=0;i<a.history.length;i++){
			pt = a.history[i];
			path+="L"+Math.round(pt.x)+","+Math.round(pt.y);
		}
		Focus.path.attr({d:path});*/

	};

})();