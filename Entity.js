//BASE CLASS FOR PLAYER AND ENEMY
//Contains base stats for an entity
var Entity = function(param){
	var self = {
		id:"",
		lobby:null,
		body:null,
		healthMax:0,
		healthCurrent:0,
		APMax:0,
		APCurrent:0,
		dieSize:0,
		dieAmount:0,
		currentAttackID:0, // the only reason this is set to ID instead of attack itself is "Maximum call stack size exceeded", node error (apparently sending too much data on emitting large entities)
		skills:[],
		conditions:[], //These are conditions like poison/disease which only last a couple of turns in a battle
		message: "", //Every entity is set to have a MESSAGE that can be sent from server (e.g. a skill is used by a player -> store message in this for the entity and send to client)
	}
	if(param){
		if(param.id)
			self.id = param.id;	
		if(param.lobby)
			self.lobby = param.lobby;
		if(param.body)
			self.body = param.body;
		if(param.healthMax){
			self.healthMax = param.healthMax;
			self.healthCurrent = param.healthMax;
		}
		if(param.APMax){
			self.APMax = param.APMax;	
			self.APCurrent = param.APMax;
		}
		if(param.dieSize)
			self.dieSize = param.dieSize;	
		if(param.dieAmount)
			self.dieAmount = param.dieAmount;
		if(param.skills)
			self.skills = param.skills
	}
	//console.log("Created Entity id:" + self.id + "\nhealthMax: " + self.healthMax + "\nAPMax: " + self.APMax+ "\ndieSize: " + self.dieSize+ "\ndieAmount: " + self.dieAmount);
	
	//SKILL RELATED ENTITY METHODS
	self.GetSkillID = function(tag){
		for(i = 0; i < self.body.skills.length; i++){
			console.log("Getting skill id " + i + " " + self.body.skills[i].tag);
			if(self.body.skills[i].tag == tag){
				console.log("in get skill id " + self.body.skills[i].tag + " equals " + tag);
				return i;
			}
		}
		return -1;
	}
	
	self.ApplyAllAttackSkills = function(attacker, target){
		for(i = 0; i < self.body.skills.length; i++){
			if(self.id == attacker.id && self.body.skills[i].attackSkill){
				console.log("FROM ENTITY CLASS using attack skill " + self.body.skills[i].name);
				self.body.skills[i].use(attacker, target);
				
			}
		}
	}
	
	self.ApplyAllTargetSkills = function(attacker, target){
		for(i = 0; i < self.body.skills.length; i++){
			if(self.id == target.id && self.body.skills[i].targetSkill){
				console.log("FROM ENTITY CLASS using target skill " + self.body.skills[i].name);
				self.body.skills[i].use(attacker, target);
				
			}
		}
	}
	
	self.ApplyAllTurnSkills = function(target){
		for(i = 0; i < self.body.skills.length; i++){
			if(self.body.skills[i].turnSkill){
				console.log("FROM ENTITY CLASS using turn skill " + self.body.skills[i].name);
				self.body.skills[i].use(target);
				self.message += self.body.skills[i].name + " +" + self.body.skills[i].amount;
				console.log("Self message is set to " + self.message);
			}
		}
	}
	
	self.ApplyTaunt = function(attacker,target){
		var tauntID = -1;
		tauntID = self.GetSkillID('taunt');
		
		console.log("Taunt checked and got it's ID! " + tauntID + " on plaeyer " + self.id);
		if(tauntID >= 0){
			console.log("User has taunt and is not the attacked player!\nUsing taunt...");
			self.body.skills[tauntID].use(attacker,target);			
		}
		
	}
	
	//CONDITION RELATED ENTITY METHODS
	self.ApplyAllTurnCondition = function(target){
		for(i = 0; i < self.conditions.length; i++){
			if(self.body.condition[i].turnCondition){
				console.log("FROM ENTITY CLASS applying turn coundition  " + self.body.conditions[i].name);
				self.body.conditions[i].apply(target, self.body.conditions[i]); //Apply current looped condition to target (target = usually (always?) self in conditions)
				
			}
		}
	}
	
	return self;
}

module.exports = Entity;