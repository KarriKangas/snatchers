//SKILL CLASS IS JUST THE IMPLEMENTATION OF WHAT EVERY SKILL DOES!
//THE BLUEPRINTS FOR SKILLS ARE DEFINED IN SKILLBLUEPRINTS.JS!
var Attack = require('./Attack.js');

var Skill = function(param){
	var instance = {
		name:param.name,
		tag:param.tag,
		id:param.id,
		chance:param.chance,
		amount:param.amount,
		attackSkill:param.attackSkill,
		targetSkill:param.targetSkill,
		turnSkill:param.turnSkill,
	}
	
	instance.use = Skill.UseList[instance.id];
	return instance;
}

Skill.UseList = [];
Skill.List = [];

//Nimble is dodge
Skill.UseNimble = function(attacker, target){
	var skillID = target.GetSkillID("nimble");
	if(target.body.skills[skillID].chance > Math.random()){
		Attack.list[attacker.currentAttackID].damage = 0;
		Attack.list[attacker.currentAttackID].message += "\nDodge!";
	}else{
		return false;
	}
}
Skill.UseList.push(Skill.UseNimble);

var nimble = Skill({
	name:"Nimble",
	tag:"nimble",
	id:0,
	chance:0.5,
	amount:0,
	attackSkill:false,
	targetSkill:true,
	turnSkill:false,
	
});
Skill.List.push(nimble);
//nimble.use();

//Taunt
Skill.UseTaunt = function(attacker, target){
	var skillID = target.GetSkillID("taunt");
	console.log("Attempting to use taunt for attacker " + attacker.id +" and target " + target.id);
	if(target.body.skills[skillID].chance > Math.random()){
		attacker.target = target;
		Attack.list[attacker.currentAttackID].Target = target;
		Attack.list[attacker.currentAttackID].message += "\nTaunt!";
	}else{
		return false;
	}
}
Skill.UseList.push(Skill.UseTaunt);

var taunt = Skill({
	name:"Taunt",
	tag:"taunt",
	id:1,
	chance:0.5,
	amount:0,
	attackSkill:false,
	targetSkill:false,
	turnSkill:false,
	
});
Skill.List.push(taunt);


//Ironskin
Skill.UseIronSkin = function(attacker, target){
	var skillID = target.GetSkillID("ironskin");
	
	if(target.body.skills[skillID].chance > Math.random()){
		//Deal damage
		var ironskinDamage = Math.ceil(target.body.skills[skillID].amount*target.healthMax);
		console.log("Target health before ironskin " + attacker.healthCurrent);
		attacker.healthCurrent -= ironskinDamage;
		console.log("ironskin damage dealt, target current health " + attacker.healthCurrent);
		Attack.list[attacker.currentAttackID].message += "\nIronskin! (" + ironskinDamage + ")";
		console.log("Message was set?" + Attack.list[attacker.currentAttackID].message);
		
	}else{
		return false;
	}
}
Skill.UseList.push(Skill.UseIronSkin);

var ironskin = Skill({
	name:"Ironskin",
	tag:"ironskin",
	id:2,
	chance:0.5,
	amount:0.01,
	attackSkill:false,
	targetSkill:true,
	turnSkill:false,
	
});
Skill.List.push(ironskin);

//Reflect is reflect based on damage taken
Skill.UseReflect = function(attacker, target){
	var skillID = target.GetSkillID("reflect");
	
	if(target.body.skills[skillID].chance > Math.random()){
		//Deal damage
		var reflectDamage = Math.ceil(target.body.skills[skillID].amount*Attack.list[attacker.currentAttackID].damage);
		console.log("Target health before reflect " + attacker.healthCurrent);
		attacker.healthCurrent -= reflectDamage
		console.log("reflect damage dealt, target current health " + attacker.healthCurrent);
		Attack.list[attacker.currentAttackID].message += "\nReflect! (" + reflectDamage + ")";
		console.log("Message was set?" + Attack.list[attacker.currentAttackID].message);
	}else{
		return false;
	}
}
Skill.UseList.push(Skill.UseReflect);

var reflect = Skill({
	name:"Reflect",
	tag:"reflect",
	id:3,
	chance:0.5,
	amount:0.10,
	attackSkill:false,
	targetSkill:true,
	turnSkill:false,
	
});
Skill.List.push(reflect);

//Vital is flat HP regen per turn
Skill.UseVital = function(target){
	var skillID = target.GetSkillID("vital");
	if(target.body.skills[skillID].chance > Math.random()){
		target.healthCurrent += target.body.skills[skillID].amount;
		console.log("Player " + target.id + " healed " + target.body.skills[skillID].amount + " with Vital!");
	}else{
		return false;
	}
}
Skill.UseList.push(Skill.UseVital);

var vital = Skill({
	name:"Vital",
	tag:"vital",
	id:4,
	chance:1,
	amount:15,
	attackSkill:false,
	targetSkill:false,
	turnSkill:true,
	
});
Skill.List.push(vital);

//Dangerous is critical hit chance
Skill.UseDangerous = function(attacker, target){
	var skillID = attacker.GetSkillID("dangerous");
	if(attacker.body.skills[skillID].chance > Math.random()){
		console.log("Dangerous! -- Damage before " + Attack.list[attacker.currentAttackID].damage);
		Attack.list[attacker.currentAttackID].damage += (Attack.list[attacker.currentAttackID].damage * attacker.body.skills[skillID].amount);
		Attack.list[attacker.currentAttackID].message += "\nDangerous! (" + Attack.list[attacker.currentAttackID].damage + ")";
		console.log("Dangerous! -- Damage after " + Attack.list[attacker.currentAttackID].damage);
	}else{
		return false;
	}
}
Skill.UseList.push(Skill.UseDangerous);

var dangerous = Skill({
	name:"Dangerous",
	tag:"dangerous",
	id:5,
	chance:0.5,
	amount:1,
	attackSkill:true,
	targetSkill:false,
	turnSkill:false,
	
});
Skill.List.push(dangerous);

//Quick is flat AP bonus, basically just APCurrent++ at the start of turn
Skill.UseQuick = function(target){
	var skillID = target.GetSkillID("quick");
	if(target.body.skills[skillID].chance > Math.random()){
		target.APCurrent += target.body.skills[skillID].amount;
		console.log("Player " + target.id + " got " + target.body.skills[skillID].amount + " AP with Quick!");
	}else{
		return false;
	}
}
Skill.UseList.push(Skill.UseQuick);

var quick = Skill({
	name:"Quick",
	tag:"quick",
	id:6,
	chance:1,
	amount:10,
	attackSkill:false,
	targetSkill:false,
	turnSkill:true,
	
});
Skill.List.push(quick);

module.exports = Skill;