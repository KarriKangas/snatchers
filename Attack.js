var Player = require('./Player.js');
var Enemy = require('./Enemy.js');

const APCOST = 5;
const MIN_ENEMYID = 5;

var Attack = function(param){
	instance = {};
	instance.id = Math.random();
	instance.Attacker = param.attacker;
	instance.Target = param.target;
	instance.success = false;
	instance.didKill = false;
	Attack.list[instance.id] = instance;	
	return instance;
}

Attack.list = {};

Attack.ApplyAttack = function(id, attacker, target){
	//Check that target is != null
	//Check that target is ALIVE
	//Check target has id>5 (means it is an enemy) 
	//Check that attacker has enough AP
	//Check if attacker HIT target
	if(target != null && target.healthCurrent > 0 && target.id > MIN_ENEMYID && attacker.APCurrent >= APCOST && Attack.CheckSuccess(attacker, target)){
		var Damage = attacker.dieAmount * (Math.floor(Math.random()*(attacker.dieSize-1)+1));
		//If attacker is a player, apply soul damage
		if(attacker.id < 5)
			Damage += Damage*attacker.soulDamage;
		
		//Reduce target health and attacker AP
		target.healthCurrent -= Damage;
		attacker.APCurrent -= APCOST;
		
		//Log damage and mark this attack successful
		console.log(Damage + " damage dealt to " + target.id);
		Attack.list[id].success = true;
		
		//If target was killed by attack
		if(target.healthCurrent <= 0){
			console.log("Enemy has been slain");
			Attack.list[id].didKill = true;
			Enemy.Kill(target.id);
			
			//If Enemy was killed, set Player target to null
			for(var i in Player.list){
				if(Player.list[attacker.id].target == target.id)
					Player.list[i].target = null;
			}
		}
		
	}else{
		console.log("For some reason: Attack failed");
	}
}

Attack.CheckSuccess = function(attacker, target){
	if(Math.random() > 0.99){
		console.log("miss!");
		return false;
	}else{
		return true;
	}
}

module.exports = Attack;