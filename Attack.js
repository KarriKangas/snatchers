//ATTACK CLASS
//Handles every attack and info related to attacks
//Also has the implementation of skills?
var Player = require('./Player.js');
var Enemy = require('./Enemy.js');

const APCOST = 5;
const MIN_ENEMYID = 5;

var Attack = function(param){
	instance = {};
	instance.id = Math.random();
	instance.damage = 0;
	instance.Attacker = param.attacker;
	instance.Target = param.target;
	instance.success = false;
	instance.didKill = false;
	instance.message = "";
	Attack.list[instance.id] = instance;	
	
	
	return instance;
}

Attack.list = {};

Attack.ApplyAttack = function(id, attacker, target){
	for(var i in Enemy.list)
		console.log("hey " + Enemy.list[i].id);
	//Check that target is != null
	//Check that target is ALIVE
	//Check target has id>5 (means it is an enemy) 
	//Check that attacker has enough AP
	//Check if attacker HIT target
	if(!target)
		return;
	
	//Set the Attack for the attacker to be this attack, if player attack
	if(attacker.id < MIN_ENEMYID)
		attacker.currentAttackID = Attack.list[id].id;

	var playerAttack = false;
	if(target.id > MIN_ENEMYID)
		playerAttack = true;
	
	if(target != null && target.healthCurrent > 0 && attacker.APCurrent >= APCOST && Attack.CheckSuccess(attacker, target)){
		var Damage = attacker.dieAmount * (Math.floor(Math.random()*(attacker.dieSize-1)+1));
		Attack.list[id].damage = Damage;
		
		//If attacker is a player, apply soul damage
		if(playerAttack){
			console.log("This is a player attack " + Damage);
			Damage += Damage*attacker.soulDamage;
			Attack.list[id].damage = Damage;
			console.log("Damage after souldamage " + Damage);
		}
		
		//Check taunts before anything, here attacker = enemy and target is player id
		//TAUNT is applied in index.js under initiateenemybehaviour!
		//if(!playerAttack)
			//attacker.ApplyTaunt(attacker, target);
				
			
		
		console.log("Applying target skills");
		//Recheck target if there was a switch
		target = Attack.list[id].Target;
		
		
		//Then apply target skills
		target.ApplyAllTargetSkills(attacker, target);
		console.log("Target skills applied");
		//Attack related skill checks here
		console.log("Applying attack skills");
		attacker.ApplyAllAttackSkills(attacker, target);

		console.log("Applied attack skills");
		
		//Recheck damage if there was a change
		Damage = Attack.list[id].damage;
		
		console.log(Attack.list[id].message + " this is the message?");
		Attack.list[id].message = Damage + Attack.list[id].message;
		console.log(Attack.list[id].message + " this is the message later");
		/*if(Attack.list[id].message.length > 0)
			Attack.list[id].message += Attack.list[id].message;*/
		
		
		
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
			if(playerAttack){
				target.Kill();
			
				/*If Enemy was killed, set Player target to null
				for(var i in Player.list){
					console.log("Are we doing something?AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
					if(Player.list[attacker.id].target == target.id)
						Player.list[i].target = null;
				}*/
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