var express = require('express');
var app = express();
var serv = require('http').Server(app);

var Entity = require('./Entity.js');
//THIS ORDER BELOW DEFINES WHICH CLASSES CAN REQUIRE WHICH CLASSES
//IN THIS CURRENT ORDER
//Player
//Enemy
//ONLY Player.js can REQUIRE Enemy.js
//REQUIRING Player.js IN Enemy.js WILL NOT WORK
//WHY? DON'T ASK? WILL IT BE FIXED? MAYBE!
var Player = require('./Player.js');
var Enemy = require('./Enemy.js');

//This line was added...
var Body = require('./Body.js');

var Attack = require('./Attack.js');
const XPBASE = 50;
const XPFACTOR = 2.5;

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

//On player connect
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	Player.onConnect(socket);
	
	//On player disconnect
	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
		console.log(socket.id + " disconnected");
		
	});
	
	//On player "battle" -ready click
	//If all players ready: Display for party leader!
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
	});
	
	//Battle starting 
	socket.on('startBattle', function(data){
		console.log("startBattle received from: " + data.sender);
		if(Player.list[data.sender].partyLeader && Player.ArePlayersGoReady()){
			createBattle(data.difficulty);
			for(var i in SOCKET_LIST){
				Asocket = SOCKET_LIST[i];
				Asocket.emit('battleTransition', {
			});
		}	
		}
	});
	
	//Attack click in battle
	socket.on("atk", function(data){
		var attack = Attack({
			attacker:Player.list[data.id],
			target:Enemy.list[Player.list[data.id].target]
		});
		Attack.ApplyAttack(attack.id, attack.Attacker, attack.Target);
		
		if(Attack.list[attack.id].success){
			for(var i in SOCKET_LIST){
				var Asocket = SOCKET_LIST[i];
				Asocket.emit("atkConfirm", {
					player:data.id,
					target:attack.Target.id,							
				});
			}
		}
		
		if(Attack.list[attack.id].didKill){
			for(var i in SOCKET_LIST){
				var Asocket = SOCKET_LIST[i];
					Asocket.emit("enemyDeath", {
						id:attack.Target.id,							
				});
			}		
		}		

		if(Enemy.AreEnemiesDead()){
			console.log("All enemies dead, display rewards");
			createRewards();
		}
	});
	
	//Snatch in battle
	socket.on("snatch", function(data){
		//CHECK SNATCH REQUIREMENTS!!!
		//1)PLAYER HAS A TARGET!
		//2)ONLY ONE ENEMY REMAINING!
		//3)THAT ENEMY HAS LESS THAN 1/3 HEALTH!
		console.log("Attempting snatch!");
		if(Player.list[data.id].target != null){
			attacker = Player.list[data.id];
			console.log("Player has a snatch target...");
			if(Enemy.list[attacker.target].healthCurrent <= (Enemy.list[attacker.target].healthMax/3)){
				console.log("Snatch target has less than 33% health!");
				if(Enemy.GetEnemyAmount() == 1){
					console.log("There is only one enemy remaining...");
					console.log("SUCCESSFUL SNATCH");
					Enemy.list[attacker.target].healthCurrent = 0;
					Player.list[data.id].body = Enemy.list[attacker.target].body;
					Player.list[data.id].bodyLevel = 1;
					Player.list[data.id].bodyExperience = 0;
					Player.list[data.id].didSnatch = true;
					for(var i in SOCKET_LIST){
						var Asocket = SOCKET_LIST[i];
						Asocket.emit('snatchSuccess', {
							id:data.id,
							body:Enemy.list[attacker.target].body,
						});
					}
					Player.ChangeBody(data.id);
					createRewards();
				}
			
			
			}	
		}
	});
	
	socket.on("skill", function(data){
		//console.log("Skill click by " + data.id);
	});
	
	socket.on("inv", function(data){
		//console.log("Inventory click by " + data.id);
	});
	
	//Ready in battle
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
	
	//Selection in battle
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
	
	//Menu stuff below
	socket.on('confirmRelease', function(data){
		Player.list[data.id].released = true;
		Player.list[data.id].body = Body.Wisp;
		Player.list[data.id].bodyExperience = 0;
		Player.list[data.id].bodyLevel = 1;
		for(var i in SOCKET_LIST){
			var Asocket = SOCKET_LIST[i];
			Asocket.emit('releaseSuccess', {
				id:data.id,
				body:Body.Wisp,
			});
		}
	});
	
	socket.on('releaseStatChange', function(data){
		if(Player.list[data.id].released){
			if(!data.plus && Player.list[data.id].soulPoints <= 0)
				return;
			
			var toAdd = 0;
			if(!data.plus){
				toAdd = 0.05;
				Player.list[data.id].soulPoints--;
			}
			if(data.plus){
				toAdd = -0.05;
				Player.list[data.id].soulPoints++;
			}
			
			switch(data.stat){
				case "damage":
					Player.list[data.id].soulDamage += toAdd;
					break;
				
				case "health":
					Player.list[data.id].soulHealth += toAdd;
					break;
				
				case "ap":
					Player.list[data.id].soulAP += toAdd;
					break;
				
			}
			for(var i in SOCKET_LIST){
				var Asocket = SOCKET_LIST[i];
				Asocket.emit('releaseStatSuccess', {
					id:data.id,
					soulPoints:Player.list[data.id].soulPoints,
					soulDamage:Player.list[data.id].soulDamage,
					soulHealth:Player.list[data.id].soulHealth,
					soulAP:Player.list[data.id].soulAP,
				});
			}
		}
			
	});
	
	socket.on('releaseContinue', function(data){
		Player.list[data.id].released = false;
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

//FUNCTION TO CREATE REWARDS AFTER A BATTLE
function createRewards(){
	var experienceReward=0;
	var goldReward=0;
	
	//Create rewards for each enemy based on their stats
	for(var i in Enemy.list){
		experienceReward += Enemy.list[i].healthMax + Enemy.list[i].APMax + Enemy.list[i].dieSize*2 + Enemy.list[i].dieAmount*5;
		goldReward += Enemy.list[i].healthMax/5 + Enemy.list[i].APMax/5 + Enemy.list[i].dieSize + Enemy.list[i].dieAmount*2;
	}
	//Floor rewards, wait 2000ms and send rewards to players
	bodyExpReward = Math.floor(experienceReward);
	soulExpReward = Math.floor(experienceReward/2);
	goldReward = Math.floor(goldReward);
	
	console.log("Rewarding all Players with " + bodyExpReward + " experience and " + goldReward + " gold!");
	
	//Go through every player and check for level ups/bodylevel ups
	for(var i in Player.list){
		var leveling = true;
		Player.list[i].experience += soulExpReward;
		while(leveling){
			if(Player.list[i].experience >= Math.floor(XPBASE*(Math.pow(Player.list[i].level, XPFACTOR)))){
				Player.list[i].level++;
				Player.list[i].soulPoints++;
				SOCKET_LIST[Player.list[i].id].emit('levelUp', {
					id:Player.list[i].id,
					soul:true,
					body:false,			
				});
				
				console.log("Player leveled up!");
				
			}else{
				leveling = false;
				console.log("Player didnt level up!" + Player.list[i].experience +" / "+ Math.floor(XPBASE*(Math.pow(Player.list[i].level, XPFACTOR))));
			}
		}
		
		leveling = true;
		if(!Player.list[i].didSnatch){
			Player.list[i].bodyExperience += bodyExpReward;
			while(leveling){
				if(Player.list[i].bodyExperience >= Math.floor(XPBASE*(Math.pow(Player.list[i].bodyLevel, XPFACTOR)))){
					Player.list[i].bodyLevel++;
					SOCKET_LIST[Player.list[i].id].emit('levelUp', {
						id:Player.list[i].id,
						soul:false,
						body:true,			
					});
					Player.ChangeBody(Player.list[i].id);
					console.log("Players body leveled up, body has level bonuses of " + Player.list[i].body.levelBonuses[0] +"/"+ Player.list[i].body.levelBonuses[1] +"/"+ Player.list[i].body.levelBonuses[2]+"/"+ Player.list[i].body.levelBonuses[3]);
				}else{
					leveling = false;
					console.log("Players body didnt level up!" + Player.list[i].bodyExperience +" / "+ Math.floor(XPBASE*(Math.pow(Player.list[i].bodyLevel, XPFACTOR))));
				}
			}
		}else{
			console.log("Player snatched a body so he is not given any body xp from this battle!");
		}
		Player.list[i].gold += goldReward;
		
	}
	
	setTimeout(function(){
		for(var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i];
			

			socket.emit('showRewards', {
				soulexp:soulExpReward,
				bodyexp:bodyExpReward,
				gold:goldReward,
				didSnatch:Player.list[socket.id].didSnatch,
			});
			console.log(Player.list[socket.id].didSnatch + " did snatch");
			if(Player.list[socket.id].didSnatch)
				Player.list[i].didSnatch = false;
		}
		console.log("Rewards sent to players, ready to clear out enemies!");
		
		Enemy.ClearEnemyList();
		Enemy.list = [];
		Enemy.ClearInitPack();
		initPack.EnemyInitPack = [];
	}, 2000);
	
	
}