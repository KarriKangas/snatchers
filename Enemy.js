var Entity = require('./Entity.js');
var Body = require('./Body.js');

var Enemy = function(param){
	var self = Entity(param);
	self.target = null;
	self.toDie = false;
	self.waitTime = Math.random() * ((60-20)+20);	
	
	
	self.getInitPack = function(){
		return {
			id:self.id,
			body:self.body,
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
	var body = Body.getBody(difficulty)
	var enemy = Enemy({
		id:Math.random()+5,
		body:body,
		healthMax:body.healthMax,
		dieSize:body.dieSize,
		dieAmount:body.dieAmount,
		APMax:body.APMax,
	});
		
	console.log("Enemy created..." + enemy.body.name);
	return enemy;
}

Enemy.Kill = function(id){
	Enemy.list[id].healthCurrent = 0;
	Enemy.list[id].APCurrent = 0;
	Enemy.list[id].APMax = 0;
	Enemy.list[id].toDie = true;
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

Enemy.AreEnemiesDead = function(){
	for(var i in Enemy.list){
		console.log("Is this enemy dead? " + Enemy.list[i].toDie);
		if(!Enemy.list[i].toDie)
			return false;
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