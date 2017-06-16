var Entity = require('./Entity.js');

var Enemy = function(param){
	var self = Entity(param);
	self.target = null;
	self.toDie = false;
	self.waitTime = Math.random() * ((60-20)+20);	
	
	
	self.getInitPack = function(){
		return {
			id:self.id,
			healthMax:self.healthMax,
			healthCurrent:self.healthCurrent,
			APMax:self.APMax,
			APCurrent:self.APCurrent,
			dieSize:self.dieSize,
			dieAmount:self.dieAmount,
			waitTime:self.waitTime,
		};
	}
	
	self.getUpdatePack = function(){
		return {
			id:self.id,
			healthMax:self.healthMax,
			healthCurrent:self.healthCurrent,
			APMax:self.APMax,
			APCurrent:self.APCurrent,
			dieSize:self.dieSize,
			dieAmount:self.dieAmount,
		};
	}
	Enemy.list[self.id] = self;
	console.log("Created Enemy id:" + self.id + "\nhealthMax: " + self.healthMax + "\nAPMax: " + self.APMax+ "\ndieSize: " + self.dieSize+ "\ndieAmount: " + self.dieAmount);	
	Enemy.initPack.push(self.getInitPack());
	return self;
	
}

Enemy.list = {};

Enemy.Create = function(difficulty){
	var enemy = Enemy({
		id:Math.random(),
		healthMax: Math.floor(Math.random() * (40-5) + 5) * difficulty,
		dieSize: Math.floor((Math.random() * (6-2) + 2) * ((difficulty+1)*0.5)) ,
		dieAmount: Math.floor((Math.random() * (2-0) + 0) + (difficulty*0.5)) ,
		APMax: Math.floor((Math.random() * (10-5) + 5) + (difficulty*difficulty)),
	});
		
	console.log("Enemy created...");
	return enemy;
}


Enemy.getAllInitPack = function(){
	var enemies = [];
	for(var i in Enemy.list){
		enemies.push(Enemy.list[i].getInitPack());

	}
	//console.log(initPack);
	return enemies;
}

Enemy.update = function(socket){
	var pack = [];
	for(var i in Enemy.list){
		var enemy = Enemy.list[i];
		pack.push(enemy.getUpdatePack());
	}
	return pack;
}

Enemy.AreEnemiesReady = function(){
	for(var i in Enemy.list){
		if(Enemy.list[i].APCurrent >= 5){
			//console.log("An enemy has more than 5AP... Requesting another round");
			return false;
		}
	}
	return true;
}

Enemy.GetEnemyAmount = function(){
	var amount = 0;
	for(var i in Enemy.list){
		if(Enemy.list[i].APCurrent >= 5){
			amount++;
		}
	}
	return amount;
}

Enemy.ClearEnemyList = function(){
	Enemy.list = [];
	
}

Enemy.ClearInitPack = function(){
	Enemy.initPack = [];
	
}

Enemy.initPack = [];

module.exports = Enemy;