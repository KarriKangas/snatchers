	var Player = function(initPack){
		self = {};
		self.id = initPack.id;
	
		self.dieSize = initPack.dieSize;
		self.dieAmount = initPack.dieAmount;		
		self.healthCurrent = initPack.healthCurrent;
		self.healthMax = initPack.healthMax;
		self.APCurrent = initPack.APCurrent;
		self.APMax = initPack.APMax;
		self.partyLeader = initPack.partyLeader;
		self.experience = initPack.experience;
		self.gold = initPack.gold;
		self.level = initPack.level;
		self.body = initPack.body;
		self.readyToBattle = initPack.readyGoBattle;
		
		self.target = null;
		self.attacking = false;
		self.ready = false;
		self.attackFrame = 0;
		
		self.inBattle = false;
		self.inMenu = true;
		self.inRewards = false;
		self.inMenuChar = false;
		
		self.Sprite = PIXI.Sprite.fromImage('client/img/Battle/' + self.body.name +'.png');
		self.healthText = new PIXI.Text('', healthStyle);
		
		self.Sprite.interactive = true;
		self.Sprite.buttonMode = true;
		
		var thisPlayerId = initPack.id;
		self.Sprite.on('pointerdown', () => {
			
			socket.emit("selection", {
				player: selfId,
				target: thisPlayerId,
			});
		});
		
		
		Player.list[self.id] = self;
		playerAmount = Player.getPlayerCount();
		console.log("A new Player has joined");	
		Player.onPlayerInfoChange(self.id);
		return self;
	}
	
	Player.list = {};
	
	
	//PLAYER. FUNCTIONS DOWN HERE
	Player.getGoReadyCount = function(){
		var counter = 0;
		for(var i in Player.list){
			if(Player.list[i].readyToBattle){
				counter++;			
				}
		}
		return counter;
	}
	
	Player.getPartyLeaderId = function(){
		for(var i in Player.list){
			if(Player.list[i].partyLeader)
				return Player.list[i].id;
		}
	}
	
	Player.getPlayerListPosition = function(id){
	var counter = 0;
		for(var i in Player.list){
			if(Player.list[i].id == id)
				return counter;
			counter++;
		}
	}
		
	Player.getPlayerCount = function(){
		var x = 0;
		for(var player in Player.list){
			x = x + 1;		
		}
		return x;
	}
		
	Player.onPlayerInfoChange = function(playerID){
		var pname = Player.list[playerID].id.toString();
		var ptarget = "";
		var pready = "Not ready";
		if(Player.list[playerID].target == null) ptarget = "";
		else ptarget = (Player.list[playerID].target.toString()).substring(2,5);
		if(Player.list[playerID].ready) pready = "Ready";
		Player.list[playerID].healthText.text = ('Player' + pname.substring(2,5) + " HP:" + Player.list[playerID].healthCurrent + "\nAP: " + Player.list[playerID].APCurrent + "\nDamage: "  + Player.list[playerID].dieAmount  +"d"+ Player.list[playerID].dieSize + "\nTarget: " + ptarget + "\n" + pready);
	}
	
	Player.getPlayerID = function(num){
	var counter = 0;
		for(var i in Player.list){
			if(counter == num)
				return Player.list[i]
			counter++;
		}
	}