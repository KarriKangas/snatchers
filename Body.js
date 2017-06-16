var Body = function(param){
	var self = {
		name:"",
		id:"",
		healthMax:0,
		APMax:0,
		dieSize:0,
		dieAmount:0,
	}
	if(param){
		if(param.name)
			self.name = param.name;
		if(param.id)
			self.id = param.id;		
		if(param.healthMax)
			self.healthMax = param.healthMax;		
		if(param.APMax)
			self.APMax = param.APMax;	
		if(param.dieSize)
			self.dieSize = param.dieSize;	
		if(param.dieAmount)
			self.dieAmount = param.dieAmount;	
		
	}
	//console.log("Created Entity id:" + self.id + "\nhealthMax: " + self.healthMax + "\nAPMax: " + self.APMax+ "\ndieSize: " + self.dieSize+ "\ndieAmount: " + self.dieAmount);
	return self;
}
Body.getBody = function(difficulty){
	var index = Math.floor(Math.random() * ((difficulty+2)-(difficulty-2))+difficulty-2);
	if(index > Body.list.length-1)
		index = Body.list.length-1
	if(index < 0)
		index = 0;
	
	console.log(index);
	return(Body.list[index]);
}

Body.list = [];
//LIST ALL BODIES HERE
Body.Wisp = Body({
	name:"Wisp",
	id:0,
	healthMax: 50,
	APMax: 10,
	dieSize: 3,
	dieAmount: 1,
});
Body.list.push(Body.Wisp);

Body.Squirrel = Body({
	name:"Squirrel",
	id:1,
	healthMax: 60,
	APMax: 11,
	dieSize: 5,
	dieAmount: 1,
});
Body.list.push(Body.Squirrel);

Body.Deer = Body({
	name:"Deer",
	id:2,
	healthMax: 70,
	APMax: 12,
	dieSize: 6,
	dieAmount: 1,
});
Body.list.push(Body.Deer);

Body.Hedgehod = Body({
	name:"Hedgehod",
	id:3,
	healthMax: 80,
	APMax: 13,
	dieSize: 3,
	dieAmount: 2,
});
Body.list.push(Body.Hedgehod);

Body.Smallsnake = Body({
	name:"Small snake",
	id:4,
	healthMax: 90,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
});
Body.list.push(Body.Smallsnake);

	
module.exports = Body;