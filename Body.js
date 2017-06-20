var Body = function(param){
	var self = {
		name:"",
		id:"",
		healthMax:0,
		APMax:0,
		dieSize:0,
		dieAmount:0,
		maxLevel:0,
		levelBonuses:[],
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
		if(param.maxLevel)
			self.maxLevel = param.maxLevel;	
		if(param.levelBonuses)
			self.levelBonuses = param.levelBonuses;	
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
//LEVEL BONUSES ARE
//0 HEALTH, 1 APMAX, 2 DIESIZE, 3 DIEAMOUNT!
Body.Wisp = Body({
	name:"Wisp",
	id:0,
	healthMax: 50,
	APMax: 10,
	dieSize: 3,
	dieAmount: 1,
	maxLevel: 5,
	levelBonuses: [ 20, 2, 2, 0 ],
		
});
Body.list.push(Body.Wisp);

Body.Squirrel = Body({
	name:"Squirrel",
	id:1,
	healthMax: 60,
	APMax: 11,
	dieSize: 5,
	dieAmount: 1,
	maxLevel: 6,
	levelBonuses: [ 25, 3, 2, 1 ],
});
Body.list.push(Body.Squirrel);

Body.Deer = Body({
	name:"Deer",
	id:2,
	healthMax: 70,
	APMax: 12,
	dieSize: 6,
	dieAmount: 1,
	maxLevel: 7,
	levelBonuses: [ 30, 3, 3, 1 ],
});
Body.list.push(Body.Deer);

Body.Hedgehog = Body({
	name:"Hedgehog",
	id:3,
	healthMax: 80,
	APMax: 13,
	dieSize: 3,
	dieAmount: 2,
	maxLevel: 8,
	levelBonuses: [ 35, 4, 2, 2 ],
});
Body.list.push(Body.Hedgehog);

Body.Smallsnake = Body({
	name:"Small snake",
	id:4,
	healthMax: 90,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 9,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Smallsnake);

Body.Lizard = Body({
	name:"Lizard",
	id:5,
	healthMax: 110,
	APMax: 15,
	dieSize: 6,
	dieAmount: 2,
	maxLevel: 10,
	levelBonuses: [ 45, 5, 3, 2 ],
});
Body.list.push(Body.Lizard);

Body.Slime = Body({
	name:"Slime",
	id:6,
	healthMax: 120,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 11,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Slime);

Body.Rat = Body({
	name:"Rat",
	id:7,
	healthMax: 140,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 12,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Rat);

Body.Turtle = Body({
	name:"Turtle",
	id:8,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Turtle);

	
module.exports = Body;