(function(){

	window.Focus = {};

	// GRAPHICS
	Focus.init = function(){

		// CREATE IRIS MASK
		var svg = Sim.model;
		var shadeRect = svg.rect(-1000,-1000,2000,2000).attr({ fill:"rgba(0,0,0,0.5)" });
		var maskCircle = svg.circle(0,0,25).attr({ fill:"#000" });
		var maskRect = svg.rect(-1000,-1000,2000,2000).attr({ fill:"#fff" });
		var group = svg.group(maskRect,maskCircle);
		shadeRect.attr({ mask:group });
		Focus.shade = shadeRect;

		// The whole graphics
		Focus.graphics = svg.group(Focus.shade);
		Focus.graphics.attr({display:"none"});

		// When you click that element, tho...
		Focus.graphics.mousedown(Focus.removeFocus);

	};

	// Set Focus
	Focus.person = null;
	Focus.setFocus = function(person){

		// Tell the previous person job's over
		if(Focus.person){
			Focus.person.isFocus = false;
		}

		// Set as person
		Focus.person = person;
		Focus.person.isFocus = true;

		// Push graphic to position
		var matrix = new Snap.Matrix();
		matrix.translate(Focus.person.x,Focus.person.y);
		Focus.graphics.transform(matrix);

		// Show it!
		Focus.graphics.attr({display:""});

		// Also, push person's graphic to the front.
		var personG = Focus.person.graphics;
		var parent = personG.parent();
		personG.remove();
		parent.append(personG);

	};

	// Animate
	Focus.animate = function(){

		// If none, naw
		if(!Focus.person) return;

		// Get position, animate to it.
		var matrix = new Snap.Matrix();
		matrix.translate(Focus.person.x,Focus.person.y);
		
		// Anim
		Focus.graphics.animate({transform:matrix}, Sim.ANIM_SPEED, mina.easeinout);

	};

	// Un-focus
	Focus.removeFocus = function(){

		// Job's over, person.
		Focus.person.isFocus = false;
		Focus.person = null;

		// Hide
		Focus.graphics.attr({display:"none"});
		
	};

})();