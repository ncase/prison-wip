// Class
function Agent(model){

	var self = this;

	// GRAPHICS
	var color = Snap.hsl(Math.random()*360, 60, 60);
	self.graphics = model.group(
		model.circle(0,0,30).attr({fill:color}),
		model.circle(-15,0,5).attr({fill:"#333"}),
		model.circle(15,0,5).attr({fill:"#333"})
	);

	// TRANSFORM
	self.x = Math.random()*model.node.clientWidth;
	self.y = Math.random()*model.node.clientHeight;
	self.scale = 0;
	self.getMatrix = function(){
		var matrix = new Snap.Matrix();
		matrix.translate(self.x,self.y);
		matrix.scale(self.scale);
		return matrix;
	}
	self.graphics.transform(self.getMatrix());

	// UPDATE
	self.update = function(){
		if(Math.random()<0.01){
			self.x = Math.random()*model.node.clientWidth;
			self.y = Math.random()*model.node.clientHeight;
			self.animate();
		}
	};
	self.animate = function(){
		self.graphics.animate( {transform:self.getMatrix()}, 500, mina.easeinout);
	};

	// (born anim)
	self.scale = 0.5;
	self.animate();

}

// Agents
var model = Snap("#model");
var agents = [];
for(var i=0;i<100;i++){
	var agent = new Agent(model);
	agents.push(agent);
}

// Update Loop
setInterval(function(){
	stats.begin();
	for(var i=0;i<agents.length;i++){
		agents[i].update();
	}
	stats.end();
},1000/30);

// STATS.JS
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
