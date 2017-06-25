var Player = require('./Player.js');
var Enemy = require('./Enemy.js');
var Lobby = function(){
	instance = {};
	instance.id = Math.random();
	instance.name = Math.random().toString(36).substring(2,6);
	instance.password = Math.random().toString(36).substring(2,6);
	instance.players = {};
	instance.enemies = {};
	instance.enemyTimer = 0;
	instance.playerTurn = true;
	
	console.log("New lobby created!   "+ instance.name + " /// " + instance.password);
	Lobby.list[instance.id] = instance;
	return instance;
}


Lobby.list = {};

Lobby.AddPlayer = function(lobbyId, playerId){
	Lobby.list[lobbyId].players[playerId] = playerId;
	Player.list[playerId].lobby = Lobby.list[lobbyId];
	//console.log("Player " + playerId + " added to lobby " + lobbyId);
	//console.log("Lobby.list " + Lobby.list[lobbyId].id + " players " + Lobby.list[lobbyId].players[playerId] + " was added");
}

Lobby.AddEnemy = function(lobbyId, enemyId){
	Lobby.list[lobbyId].enemies[enemyId] = enemyId;
	//console.log("Enemy " + enemyId + " added to lobby " + lobbyId);
}

Lobby.ArePlayersReady = function(lobbyId){
	//console.log("is player ready?");
	for(var i in Lobby.list[lobbyId].players){
		//console.log(Lobby.list[lobbyId].players[i] + " listing players..." + " and is he ready?: " + Player.list[Lobby.list[lobbyId].players[i]].ready);
		if(!Player.list[Lobby.list[lobbyId].players[i]].ready){
			//A player is not ready
			return false;
		}
	}
	return true;
	
}

Lobby.PlayerCount = function(lobbyId){
	var amount = 0;
	for(var i in Lobby.list[lobbyId].players){
		amount++;
	}
	return amount;
}

Lobby.ArePlayersGoReady = function(lobbyId){
	//console.log("Checking if players are ready in " + lobbyId);
	for(var i in Lobby.list[lobbyId].players){
		if(!Player.list[Lobby.list[lobbyId].players[i]].readyGoBattle)
			return false;
	}
	return true;
	
}

Lobby.EnemyCount = function(lobbyId){
	var amount = 0;
	//console.log("counting amount from " + lobbyId);
	for(var i in Lobby.list[lobbyId].enemies){
		amount++;
	}
	//console.log("And amount is... " + amount);
	return amount;
}

Lobby.AliveEnemyCount = function(lobbyId){
	var amount = 0;
	//console.log("counting amount from " + lobbyId);
	for(var i in Lobby.list[lobbyId].enemies){
		if(!Enemy.list[Lobby.list[lobbyId].enemies[i]].toDie) //THIS IS ADDED NOT TESTED
			amount++;
	}
	return amount;
}

Lobby.GetRandomPlayer = function(lobbyId){
	//console.log("getting random player...");
	var amount = Lobby.PlayerCount(lobbyId);
	var chosen = Math.floor(Math.random() * (amount-0)+0);
	var counter = 0;
	for(var i in Lobby.list[lobbyId].players){
		//console.log("counting players..." + counter +" chosen is " + chosen);
		if(counter == chosen){
			//console.log("Returning " + Lobby.list[lobbyId].players[i]);
			return Lobby.list[lobbyId].players[i];
			
		}
		counter++;
	}
	
}

Lobby.AreEnemiesReady = function(lobbyId){
	//console.log("Checking lobby " + lobbyId + " are enemies ready here?");
	//for(var i in Enemy.list)
		//console.log("Listing enemies.. " + Enemy.list[i].id);
	for(var i in Lobby.list[lobbyId].enemies){
		//console.log("Checking " + lobbyId + " enemy " + Lobby.list[lobbyId].enemies[i]);
		//console.log("SO?! " + Enemy.list[Lobby.list[lobbyId].enemies[i]]);
		if(Enemy.list[Lobby.list[lobbyId].enemies[i]].APCurrent >= 5){
			//console.log("An enemy has more than 5AP... Requesting another round");
			return false;
		}
	}
	return true;
}

Lobby.AreEnemiesDead = function(lobbyId){
	for(var i in Lobby.list[lobbyId].enemies){
		//console.log("checking lobby " + lobbyId);
		//console.log("current check " + Enemy.list[Lobby.list[lobbyId].enemies[i]]);
		//console.log("soo " + Lobby.list[lobbyId].enemies[i]);
		//console.log("Checking an Enemy in Lobby. , is ded?" + Enemy.list[Lobby.list[lobbyId].enemies[i]].toDie);
		if(!Enemy.list[Lobby.list[lobbyId].enemies[i]].toDie)
			return false;
	}
	return true;
}


module.exports = Lobby;