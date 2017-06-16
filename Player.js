var Entity = require('./Entity.js');
var Enemy = require('./Enemy.js');
var Body = require('./Body.js');
console.log("PLAYER: " + Body.Deer.name);
var Player = function(param){
	var self = Entity(param);
	self.target = null;
	self.ready = false;
	self.readyGoBattle = false;
	self.partyLeader = false;
	self.experience = 0;
	self.gold = 0;
	self.level = 1;
	console.log("This is connected players id: " + param.id);
	self.healthMax+=100;
	self.healthCurrent+=100;
	
	self.getInitPack = function(){
		return {
			id:self.id,
			body:Body.Wisp,
			healthMax:self.healthMax,
			healthCurrent:self.healthCurrent,
			APMax:self.APMax,
			APCurrent:self.APCurrent,
			dieSize:self.dieSize,
			dieAmount:self.dieAmount,
			readyGoBattle:self.readyGoBattle,
			partyLeader:self.partyLeader,
			experience:self.experience,
			gold:self.gold,
			level:self.level,
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
			dieSize:self.dieSize,
			dieAmount:self.dieAmount,
		};
	}
	
	Player.list[self.id] = self;
	
	if(Player.getPlayerCount() == 1)
		self.partyLeader = true;
	
	Player.initPack.push(self.getInitPack());
	return self;
	
}
Player.one = 100;
Player.list = {};

//THIS SHOULD BE CHANGED TO REFLECT DATABASE
Player.onConnect = function(socket){
	var player = Player({
		id:socket.id,
		body:Body.Wisp,
		healthMax: Body.Wisp.healthMax+100,
		APMax: Body.Wisp.APMax+10,
		dieSize: Body.Wisp.dieSize+5,
		dieAmount: Body.Wisp.dieAmount+3,
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
	delete Player.list[socket.id];
	Player.removePack.push(socket.id);
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
	for(var player in Player.list){
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

Player.ClearInitPack = function(){
	Player.initPack = [];
}

Player.ClearRemovePack = function(){
	Player.removePack = [];
}


module.exports = Player;