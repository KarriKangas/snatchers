var Entity = require('./Entity.js');
var Enemy = require('./Enemy.js');
var Body = require('./Body.js');

var Player = function(param){
	var self = Entity(param);
	
	self.target = null; //Player target in battle
	self.ready = false; //is player ready in battle
	self.readyGoBattle = false; //is player ready in menu
	self.partyLeader = false; //is player partyleader
	self.didSnatch = false; //did player snatch a new body in this battle
	self.released = false; //has player released his current body to spend soul points
	self.experience = 0;
	self.gold = 0;
	self.level = 1;
	console.log("This is connected players id: " + param.id);
	self.healthMax = 0;
	self.healthCurrent= 0;
	self.bodyLevel = 1;
	self.bodyExperience = 0;
	
	
	//Soul stats
	self.soulDamage = 5.0;
	self.soulHealth = 1.0;
	self.soulAP = 1.0;
	self.soulPoints = 5;
	
	//THIS IS JUST FOR TESTING BEFORE DATABASE IMPLEMENTATION
	if(!self.body)
		self.body = Body.Wisp;
	
	Player.list[self.id] = self;
	Player.ChangeBody(self.id);
	Player.ApplySoulBonuses(self.id);
	
	self.getInitPack = function(){
		return {
			id:self.id,
			lobby:self.lobby,
			body:self.body,
			healthMax:self.body.healthMax ,
			healthCurrent:self.body.healthMax,
			APMax:self.APMax,
			APCurrent:self.APMax,
			dieSize:self.dieSize,
			dieAmount:self.dieAmount,
			readyGoBattle:self.readyGoBattle,
			partyLeader:self.partyLeader,
			experience:self.experience,
			gold:self.gold,
			level:self.level,
			bodyLevel:self.bodyLevel,
			bodyExperience:self.bodyExperience,
			soulDamage: self.soulDamage,
			soulHealth: self.soulHealth,
			soulAP: self.soulAP,
			soulPoints: self.soulPoints,
		};
	}
	
	self.getUpdatePack = function(){
		return {
			id:self.id,
			healthMax:self.healthMax,
			ready:self.ready,
			healthCurrent:self.healthCurrent,
			APMax:self.APMax,
			APCurrent:self.APCurrent,
			dieSize:self.dieSize ,
			dieAmount:self.dieAmount,
		};
	}
	//Change body to update values

	//Player.list[self.id] = self;
	
	
	Player.initPack.push(self.getInitPack());
	//console.log(self.getInitPack());
	return self;
	
}

Player.list = {};

//THIS SHOULD BE CHANGED TO REFLECT DATABASE
Player.onConnect = function(socket){
	var player = Player({
		id:socket.id,
		body:Body.Wisp,
		healthMax: Body.Wisp.healthMax,
		APMax: Body.Wisp.APMax,
		dieSize: Body.Wisp.dieSize,
		dieAmount: Body.Wisp.dieAmount,
	});
		
	socket.emit('init',{
		selfId:socket.id,
		PlayerInitPack:Player.getAllInitPack(),
		EnemyInitPack:Enemy.getAllInitPack(),
	});
}

Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list){
		players.push(Player.list[i].getInitPack());
	}
	return players;
}

Player.initPack = [];
Player.removePack = [];

Player.onDisconnect = function(socket){
	console.log(socket.id + " disconnected, was leader: " + Player.list[socket.id].partyLeader);
	if(Player.list[socket.id].partyLeader){
		var n = 0;
		for(var i in Player.list){
			if(n == 1){
				Player.list[i].partyLeader = true;
				console.log("Party leader switched to: " + Player.list[i].id);
				for(var j in SOCKET_LIST){
					Asocket = SOCKET_LIST[j];
					Asocket.emit('leaderSwitch', {
						newLeader:Player.list[i].id,
					});
				}
				
				
			}
			n++;
		}
	}
	
	//Delete player from Lobby (if player has a lobby) as well as global Player.list
	//And delete the whole lobby!
	if(Player.list[socket.id].lobby != null)	
		delete Player.list[socket.id].lobby.players[socket.id];	
		
	
	
	
	delete Player.list[socket.id];
	Player.removePack.push(socket.id);
}

Player.ChangeBody = function(id){
	var body = Player.list[id].body;
	Player.ApplySoulBonuses(id);
}
//THIS IS A WONKY METHOD
Player.ApplySoulBonuses = function(id){
	var body = Player.list[id].body;
	
	Player.list[id].healthMax = body.healthMax + (Player.list[id].bodyLevel*body.levelBonuses[0]);
	Player.list[id].healthCurrent = Player.list[id].healthMax;
	Player.list[id].dieSize = body.dieSize + (Player.list[id].bodyLevel*body.levelBonuses[2]);
	Player.list[id].dieAmount = body.dieAmount + (Player.list[id].bodyLevel*body.levelBonuses[3]);
	Player.list[id].APMax = body.APMax + (Player.list[id].bodyLevel*body.levelBonuses[1]);
	Player.list[id].APCurrent = Player.list[id].APMax;
	
	Player.list[id].healthMax += Player.list[id].healthMax * Player.list[id].soulHealth;
	Player.list[id].APMax += Player.list[id].APMax * Player.list[id].soulAP;
	Player.list[id].healthCurrent = Player.list[id].healthMax;
	Player.list[id].APCurrent = Player.list[id].APMax;
}


Player.update = function(socket){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		pack.push(player.getUpdatePack());
	}
	return pack;
}

Player.getPlayerCount = function(){
	var x = 0;
	for(var i in Player.list){
			x = x + 1;		
	}
	return x;
}

Player.getPlayerCountInLobby = function(lobbyId){
	var x = 0;
	for(var i in Player.list){
		if(Player.list[i].lobby.id == lobbyId)
			x = x + 1;		
	}
	return x;
}

Player.getPlayerID = function(num){
	var counter = 0;
	for(var i in Player.list){
		if(counter == num)
			return Player.list[i]
		counter++;
	}
}

Player.ArePlayersGoReady = function(){
	for(var i in Player.list){
		if(!Player.list[i].readyGoBattle)
			return false;		
	}
	return true;
}

Player.ArePlayersGoReadyLobby = function(lobbyId){
	for(var i in Player.list){
		if(!Player.list[i].readyGoBattle && Player.list[i].lobbyId == lobbyId)
			return false;		
	}
	return true;
	
}

Player.ClearInitPack = function(){
	Player.initPack = [];
}

Player.ClearRemovePack = function(){
	Player.removePack = [];
}


module.exports = Player;