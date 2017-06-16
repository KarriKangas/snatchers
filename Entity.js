var Entity = function(param){
	var self = {
		id:"",
		healthMax:0,
		healthCurrent:0,
		APMax:0,
		APCurrent:0,
		dieSize:0,
		dieAmount:0,
	}
	if(param){
		if(param.id)
			self.id = param.id;		
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
	}
	//console.log("Created Entity id:" + self.id + "\nhealthMax: " + self.healthMax + "\nAPMax: " + self.APMax+ "\ndieSize: " + self.dieSize+ "\ndieAmount: " + self.dieAmount);
	return self;
}

module.exports = Entity;