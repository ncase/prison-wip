(function(){

	window.Focus = {};

	// GRAPHICS
	Focus.init = function(){

		// Create element
		var shadeRect = model.rect(-1000,-1000,2000,2000).attr({ fill:"rgba(0,0,0,0.5)" });
		var maskCircle = model.circle(0,0,50).attr({ fill:"#000" });
		var maskRect = model.rect(-1000,-1000,2000,2000).attr({ fill:"#fff" });
		var group = model.group(maskRect,maskCircle);
		shadeRect.attr({ mask:group });
		Focus.element = shadeRect;
		Focus.element.attr({display:"none"});

		// When you click that element, tho...
		Focus.element.mousedown(Focus.removeFocus);

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
		Focus.element.transform(matrix);	

		// Show it!
		Focus.element.attr({display:""});

	};

	// Animate
	Focus.animate = function(){

		// If none, naw
		if(!Focus.agent) return;

		// Get position, animate to it.
		var matrix = new Snap.Matrix();
		matrix.translate(Focus.agent.x,Focus.agent.y);
		Focus.element.animate({transform:matrix}, 500, mina.easeinout);

	};

	// Un-focus
	Focus.removeFocus = function(){

		// Job's over, agent.
		Focus.agent.isFocus = false;
		Focus.agent = null;

		// Hide
		Focus.element.attr({display:"none"});
		
	};

})();