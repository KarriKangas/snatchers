var Enemy = function(initPack){
	self = {};
	self.id = initPack.id;
	
	self.dieSize = initPack.dieSize;
	self.dieAmount = initPack.dieAmount;
	self.healthCurrent = initPack.healthCurrent;
	self.healthMax = initPack.healthMax;
	self.APCurrent = initPack.APCurrent;
	self.APMax = initPack.APMax;
	self.dead = false;
	self.body = initPack.body;
	//Random wait time 20-60 frames for enemy actions
	self.waitTime = initPack.waitTime;
	self.currentWait = initPack.waitTime;
	self.attackFrame = 0;
	self.attacking = false;
	
	self.Sprite = PIXI.Sprite.fromImage('client/img/Battle/' + self.body.name +'.png');
	self.Sprite.scale.x = -1;
	self.DeadSprite = PIXI.Sprite.fromImage('client/img/Battle/Dead.png');
	self.DeadSprite.scale.x = -1;
	self.healthText = new PIXI.Text('', healthStyle);
	
	self.Sprite.interactive = true;
	self.Sprite.buttonMode = true;
	
	var thisEnemyId = initPack.id;
	self.Sprite.on('pointerdown', () => {
		
	if(!Enemy.list[thisEnemyId].dead){
		socket.emit("selection", {
			player: selfId,
				target: thisEnemyId,
			});
		}
	});
			
			
	Enemy.list[self.id] = self;

	Enemy.onEnemyInfoChange(self.id);
	return self;
		
	}
		
Enemy.list = {};

Enemy.getEnemyListPosition = function(id){
	var counter = 0;
	for(var i in Enemy.list){	
		if(Enemy.list[i].id == id)
			return counter;
		counter++;
	}
}
		
Enemy.onEnemyInfoChange = function(enemyID){
	var ename = Enemy.list[enemyID].id.toString();
	Enemy.list[enemyID].healthText.text = ('Enemy' + ename.substring(2,5) + " HP:" + Enemy.list[enemyID].healthCurrent + "\nAP: " + Enemy.list[enemyID].APCurrent + "\nDamage: "  + Enemy.list[enemyID].dieAmount  +"d"+ Enemy.list[enemyID].dieSize);
}