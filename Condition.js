//HOW DO CONDITIONS WORK example:
/*
1) A Entity (The Attacker) with a Skill which Applies a Condition Attacks a Target
2) The Condition is Added to the Target Entity(.conditions list)
2.5) The added Conditions stats are affected by The Attackers Bodys stats
3) At the start of each Turn, every Entity Applies all its Conditions (Entity.ApplyAllTurnCondition)
4) The Conditions stats are now fetched from the Entities own Conditions List
*/

//NOTE:
//Do NOT confuse the conditions listed here as skills!!!
//The Skills which APPLY these CONDITIONS are listed in Skill.js and look rather similar
//However with this class we can keep record of the amount/duration/chance etc. of each buff on each entity!
//The SKILLS depictions of these CONDITIONS merely APPLY them

/*TODO
CONDITIONS SHOULD NOW BE ADDED TO TARGET CORRECTLY
NOW THE ONLY THING NEEDED IS TO CHECK FROM THEM THE SAME WAS AS TURNSKILLS IN INDEX.JS
AND CREATE FLOATING TEXTS ACCORDINGLY!
*/

var Condition = function(param){
	var instance = {
		name:param.name,
		tag:param.tag,
		id:param.id,
		chance:param.chance,
		amount:param.amount,
		duration:param.duration,
		passive:param.passive, //Tells if the Condition is passive (on player all the time)
		turnCondition:param.turnCondition, //Opposed to turnConditions, which are applied at the start of every turn
	}
	
	instance.applier = null; //When a condition is created, it's constructor does not include the applier
	instance.apply = Condition.ApplyList[instance.id]; //Every condition needs to have an "apply" method, this is applied "duration" -times
	return instance;
}

Condition.ApplyList = [];
Condition.List = [];

Condition.GetConditionID = function(tag) {
	for(var i in Condition.List){
		console.log("Looking for condition: " + tag);
		if(Condition.List[i].tag == tag){
			console.log("Condition found at " + Condition.List[i].id);
			return Condition.List[i].id;
		}
	}
}

Condition.ApplyPoison = function(applier, target, condition){
	var skillID = target.GetSkillID("poison");
	if(condition.chance > Math.random()){
		var poisonDamage = condition.amount
		target.healhCurrent -= poisonDamage;
		//Send some kind of message to client (maybe include Condition.message in Condition?)
		console.log("Poison procced on target " + poisonDamage + " damage");
	}else{
		return false;
	}

}
Condition.ApplyList.push(Condition.ApplyPoison);

var poison = Condition({
	name:"Poison",
	tag:"poison",
	id:0,
	chance:1,
	amount:0, //Amount is set at the applying of a condition in Skill.js
	duration:5,
	passive:false,
	turnCondition:true,
	
});
Condition.List.push(poison);

Condition.ApplyDisease = function(applier, target, condition){
	var skillID = target.GetSkillID("disease");
	if(condition.chance > Math.random()){
		var diseaseDamage = condition.amount
		target.healhCurrent -= diseaseDamage;
		//Send some kind of message to client (maybe include Condition.message in Condition?)
		console.log("Diseased procced on target and dealt " + diseaseDamage + " damage");
	}else{
		return false;
	}

}
Condition.ApplyList.push(Condition.ApplyDisease);

var disease = Condition({
	name:"Disease",
	tag:"disease",
	id:1,
	chance:1,
	amount:0, //Amount is set at the applying of a condition in Skill.js
	duration:5,
	passive:false,
	turnCondition:true,
	
});
Condition.List.push(disease);


module.exports = Condition;