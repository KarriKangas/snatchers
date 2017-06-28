var Skill = require('./Skill.js');

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
		skills:[],
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
		if(param.skills)
			self.skills = param.skills;
	}
	//console.log("Created Entity id:" + self.id + "\nhealthMax: " + self.healthMax + "\nAPMax: " + self.APMax+ "\ndieSize: " + self.dieSize+ "\ndieAmount: " + self.dieAmount);
	//for(var i in self.skills)
		//console.log("Created a body " + self.name + " with " + self.skills[0].name);
		
	
	return self;
}

Body.getBody = function(difficulty){
	//console.log("Getting body with " + difficulty + " difficulty");
	var index = Math.round(Math.random() * ((difficulty+3)-(difficulty))+difficulty);;
	if(index > Body.list.length-1)
		index = Body.list.length-1
	if(index < 0)
		index = 0;
	
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
	skills:[Skill.List[6]], //FOR TESTING ADD WISP A DIFFERENT SKILL EVERY ROUND
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
	skills:[Skill.List[0]],
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
	skills:[Skill.List[1]],
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
	skills:[Skill.List[2]],
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
	skills:[Skill.List[5]],
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
	skills:[Skill.List[4]],
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

Body.Orphan = Body({
	name:"Orphan",
	id:9,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Orphan);

Body.Straydog = Body({
	name:"Stray dog",
	id:10,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Straydog);


Body.Wasteelemental = Body({
	name:"Waste elemental",
	id:11,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Wasteelemental);


Body.Tomcat = Body({
	name:"Tomcat",
	id:12,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Tomcat);


Body.Giantcatfish = Body({
	name:"Giant catfish",
	id:13,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Giantcatfish);


Body.Goblin = Body({
	name:"Goblin",
	id:14,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Goblin);


Body.Angryfisherman = Body({
	name:"Angry fisherman",
	id:15,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Angryfisherman);


Body.Distrubedswan = Body({
	name:"Distrubed swan",
	id:16,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Distrubedswan);

Body.Pickpocket = Body({
	name:"Pick pocket",
	id:17,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Pickpocket);


Body.Alphadog = Body({
	name:"Alpha dog",
	id:18,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Alphadog);


Body.Swindler = Body({
	name:"Swindler",
	id:19,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Swindler);


Body.Duelist = Body({
	name:"Duelist",
	id:20,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Duelist);


Body.Boar = Body({
	name:"Boar",
	id:21,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Boar);


Body.Wolf = Body({
	name:"Wolf",
	id:22,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Wolf);


Body.Giantspider = Body({
	name:"Giant spider",
	id:23,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Giantspider);


Body.Porcupine = Body({
	name:"Turtle",
	id:24,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Porcupine);


Body.Troll = Body({
	name:"Troll",
	id:25,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Troll);


Body.Giantrat = Body({
	name:"Giant rat",
	id:26,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Giantrat);


Body.Alligator = Body({
	name:"Alligator",
	id:27,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Alligator);


Body.Unstableflesh = Body({
	name:"Unstable flesh",
	id:28,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Unstableflesh);

Body.Goblinshaman = Body({
	name:"Goblin shaman",
	id:29,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Goblinshaman);

Body.Floatingeye = Body({
	name:"Floating eye",
	id:30,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Floatingeye);

Body.Cavebear = Body({
	name:"Cave bear",
	id:31,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Cavebear);

Body.Forgottenminer = Body({
	name:"Forgotten miner",
	id:32,
	healthMax: 150,
	APMax: 14,
	dieSize: 5,
	dieAmount: 2,
	maxLevel: 13,
	levelBonuses: [ 40, 5, 3, 2 ],
});
Body.list.push(Body.Forgottenminer);





	
module.exports = Body;