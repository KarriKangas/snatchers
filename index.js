var express = require('express');
var app = express();
var serv = require('http').Server(app);
var Player = require('./Player.js');
var Entity = require('./Entity.js');
var Enemy = require('./Enemy.js');
app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 3000);
console.log("Server started");

var io = require('socket.io') (serv,{});
var playerTurn = true;
var enemyTimer = 0;
SOCKET_LIST = {};

io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	Player.onConnect(socket);
	
	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
		console.log(socket.id + " disconnected");
		
	});
	
	socket.on('goBattle',function(data){
		if(Player.list[data.id].readyGoBattle != true){
			Player.list[data.id].readyGoBattle = true;
			console.log(Player.list[data.id].id + " is now ready for battle!");
			for(var i in SOCKET_LIST){
				Asocket = SOCKET_LIST[i];
				Asocket.emit('confirmGoBattle', {
					id:data.id,
				});
				
			}
			console.log(Player.list[data.id].id + " is now ready for battle!");
			console.log(SOCKET_LIST[data.id].id + " is now ready for battle!");
		}
		
		for(var i in Player.list){
			if(!Player.list[i].readyGoBattle){
				console.log("All players are not ready");
				return;
			}
		}
		
		console.log("All players ARE ready!");
		for(var i in SOCKET_LIST){
			Asocket = SOCKET_LIST[i];
			Asocket.emit('allPlayersReady', {	
			});
		}

		console.log(Player.list[data.id].id + " is now ready for battle!");
		console.log(SOCKET_LIST[data.id].id + " is now ready for battle!");
	});
	
	socket.on('startBattle', function(data){
		console.log("startBattle received from: " + data.sender);
		if(Player.list[data.sender].partyLeader && Player.ArePlayersGoReady()){
			createBattle(data.difficulty);
			console.log("emitting battleTransition1");
			for(var i in SOCKET_LIST){
				Asocket = SOCKET_LIST[i];
				Asocket.emit('battleTransition', {
			});
		}	
		console.log("All battleTransitions2");
		}
	});
	
	socket.on("atk", function(data){
		console.log(Player.list[data.id].target + " and " + Player.list[data.id].APCurrent);
		if(Player.list[data.id].target != null){
			var attacker = Player.list[data.id];
			if(attacker.APCurrent >= 5){
				var damage = attacker.dieAmount * (Math.floor(Math.random()*(attacker.dieSize-1)+1));
				attacker.APCurrent-=5;
				Enemy.list[attacker.target].healthCurrent -= damage;
				
				console.log("Rolling " + attacker.dieAmount + " dices of size " + attacker.dieSize);
				console.log(attacker.id + " attacked " + attacker.target + " for " + damage + ". Target now has " + Enemy.list[attacker.target].healthCurrent + " health." + " Attacker now has " + attacker.APCurrent + " AP.");
				
				for(var i in SOCKET_LIST){
					var Asocket = SOCKET_LIST[i];
					Asocket.emit("atkConfirm", {
						player:data.id,
						target:attacker.target,							
					});
				}
				
				if(Enemy.list[attacker.target].healthCurrent <= 0){
					console.log("An enemy has been slain");
					Enemy.list[attacker.target].healthCurrent = 0;
					Enemy.list[attacker.target].APCurrent = 0;
					Enemy.list[attacker.target].APMax = 0;
					Enemy.list[attacker.target].toDie = true;
					
					for(var i in SOCKET_LIST){
						var Asocket = SOCKET_LIST[i];
						Asocket.emit("enemyDeath", {
							id:attacker.target,							
						});
					}
				
					for(var i in Player.list){
						if(Player.list[data.id].target == attacker.target)
							Player.list[i].target = null;
					}			
				}
				
				for(var i in Enemy.list){
					if(!Enemy.list[i].toDie)
						return;
					
				}
				console.log("All enemies dead, display rewards");
				createRewards();
			}
		}
	});
	
	socket.on("skill", function(data){
		//console.log("Skill click by " + data.id);
	});
	
	socket.on("inv", function(data){
		//console.log("Inventory click by " + data.id);
	});
	
	socket.on("rdy", function(data){
		if(Player.list[data.id].ready)
			Player.list[data.id].ready = false;
		else
			Player.list[data.id].ready = true;
		
		for(var i in SOCKET_LIST){
			var Asocket = SOCKET_LIST[i];
			Asocket.emit("confirmRdy", {
				player:data.id,
				ready:Player.list[data.id].ready,
			});
		}
		
		for(var i in Player.list){
			if(Player.list[i].ready){
				
			}
			else
				return;
			
		}
		
		playerTurn = false;
		console.log("All players are ready, initiate enemy behavior!");
		initiateEnemyBehavior();	
	});
	
	socket.on("selection", function(data){
		console.log("Player " + data.player + " selected " + data.target);
		Player.list[data.player].target = data.target;
		
		for(var i in SOCKET_LIST){
			var Asocket = SOCKET_LIST[i];
			Asocket.emit("confirmSelect", {
				player:data.player,
				target:data.target,
			});
		}
	});	
});
var PlayerInitPack = Player.initPack;
var EnemyInitPack = Enemy.initPack;
var PlayerRemovePack = Player.removePack;

var initPack = {PlayerInitPack, EnemyInitPack};
var removePack = {player:[], enemy:[]};

setInterval(function(){	

	initPack.PlayerInitPack = Player.initPack;
	initPack.EnemyInitPack = Enemy.initPack;
	removePack.PlayerRemovePack = Player.removePack;
	
	var pack = {
		player:Player.update(),
		enemy:Enemy.update()
	}
	
	var initCounter = 1;
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init',initPack);
		socket.emit('update', pack);
		
		if(initCounter == Player.getPlayerCount()){
			Player.ClearInitPack();
			Enemy.ClearInitPack();
			PlayerInitPack = [];
			EnemyInitPack = [];
		}
		initCounter++;
	}
	
	var removeCounter = 1;
	if(removePack.PlayerRemovePack.length > 0){
		for(var i in SOCKET_LIST){
			
			var socket = SOCKET_LIST[i];
			socket.emit('remove', removePack);	
	
			if(removeCounter == Player.getPlayerCount()){			
				Player.ClearRemovePack();
				PlayerRemovePack = [];
					
			}
		removeCounter++;			
		}
	}
	
	removePack.player = [];
	removePack.enemy = [];
	
	if(!playerTurn){
		enemyTimer++;
		if(enemyTimer == 80 && !Enemy.AreEnemiesReady()){
			console.log("New enemy round!");
			initiateEnemyBehavior();
		}
		else if(enemyTimer == 80){
			console.log("Player turn!");
			for(var i in SOCKET_LIST){
				var socket = SOCKET_LIST[i];
				socket.emit('playerTurn');
			}
			for(var i in Enemy.list){
				Enemy.list[i].APCurrent = Enemy.list[i].APMax;
			}
			for(var i in Player.list){
				Player.list[i].ready = false;		
				Player.list[i].APCurrent = Player.list[i].APMax;
			}
		}
	}
	
}, 1000/25);

function initiateEnemyBehavior(){
	enemyTimer = 0;
	var playerAmount = Player.getPlayerCount();
	for(var i in Enemy.list){
		//console.log(Enemy.list[i].id + " is acting...");
		if(Enemy.list[i].APCurrent >= 5){
			Enemy.list[i].target = Player.getPlayerID(Math.floor(Math.random() * (playerAmount-0)+0));
			console.log(Enemy.list[i].id +" target is now " + Enemy.list[i].target.id);
			
			var damage = Enemy.list[i].dieAmount * (Math.floor(Math.random()*(Enemy.list[i].dieSize-1)+1));
			
			Player.list[Enemy.list[i].target.id].healthCurrent -= damage;
			Enemy.list[i].APCurrent -= 5;
			
			var eIdToSend = Enemy.list[i].id;
			var tIdToSend = Enemy.list[i].target.id;
			for(var i in SOCKET_LIST){
				var socket = SOCKET_LIST[i];
				socket.emit('enemyAttack', {
					enemyID: eIdToSend,
					targetID: tIdToSend,
				
				});
			}
		}
	}
}	

function createBattle(difficulty){
	//Create enemies for battle
	var enemyAmount = Math.floor(Math.random() * (3-1)+1);
	for(var i = 0; i < enemyAmount; i++){
		var enemy = Enemy.Create(difficulty);	
	}
	//Set all enemies readyGoBattle false
	for(var i in Player.list){
		Player.list[i].readyGoBattle = false;
		Player.list[i].APCurrent = Player.list[i].APMax;
	}
}

function createRewards(){
	var experienceReward=0;
	var goldReward=0;
	
	//Create rewards for each enemy based on their stats
	for(var i in Enemy.list){
		experienceReward += Enemy.list[i].healthMax + Enemy.list[i].APMax + Enemy.list[i].dieSize*2 + Enemy.list[i].dieAmount*5;
		goldReward += Enemy.list[i].healthMax/5 + Enemy.list[i].APMax/5 + Enemy.list[i].dieSize + Enemy.list[i].dieAmount*2;
	}
	//Floor rewards, wait 2000ms and send rewards to players
	experienceReward = Math.floor(experienceReward);
	goldReward = Math.floor(goldReward);
	
	console.log("Rewarding all Players with " + experienceReward + " experience and " + goldReward + " gold!");
	
	setTimeout(function(){
		for(var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i]
			socket.emit('showRewards', {
				exp:experienceReward,
				gold:goldReward,
				
			});
		}
		console.log("Rewards sent to players, ready to clear out enemies!");
		Enemy.ClearEnemyList();
		Enemy.list = [];
		Enemy.ClearInitPack();
		initPack.EnemyInitPack = [];
	}, 2000);
	
	
}