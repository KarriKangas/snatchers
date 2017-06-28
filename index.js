var express = require('express');
var app = express();
var serv = require('http').Server(app);

var Lobby = require('./Lobby.js');
var Entity = require('./Entity.js');

var Player = require('./Player.js');
var Enemy = require('./Enemy.js');

var Body = require('./Body.js');

var Attack = require('./Attack.js');

var Skill = require('./Skill.js');

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
SOCKET_LIST = {};

//On player connect
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	Player.onConnect(socket);
	
	//On player disconnect
	socket.on('disconnect', function(){
		var deletedPlayerLobbyId = -1;
		if(Player.list[socket.id].lobby != null)
			deletedPlayerLobbyId = Player.list[socket.id].lobby.id;
		
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
		
		if(deletedPlayerLobbyId != -1 && Lobby.PlayerCount(deletedPlayerLobbyId) == 0){
			Lobby.DeleteLobby(deletedPlayerLobbyId);
		}
		
		//console.log(socket.id + " disconnected");
		
	});
	
	//SIGN IN STUFF
	socket.on('signIn', function(data){
		
		socket.emit('signInResponse', {
			success:true,
			
		});
	});
	
	socket.on('lobbyJoin', function(data){
		console.log("attempting to join lobby " + data.name);
		for(var i in Lobby.list){
			if(data.name == Lobby.list[i].name && data.password == Lobby.list[i].password){
				console.log("Joining lobby succesful!");
				Lobby.AddPlayer(Lobby.list[i].id, data.id);
				Player.list[data.id].lobby = Lobby.list[i];
				
				//THIS IS TO TELL EVERY PLAYER ALREADY IN THE LOBBY THAT A NEW PLAYER HAS JOINED!
				for(var j in SOCKET_LIST){
					Asocket = SOCKET_LIST[j];
					if(Player.list[j].lobby != null && Player.list[j].lobby.id == Lobby.list[i].id){
						Asocket.emit('lobbyJoin', {
							id:data.id,
							lobby:Lobby.list[i],
							leader:false,
						});
					}
					
				}
				
				//THIS IS TO TELL THE NEW PLAYER ABOUT EVERY PLAYER IN THE LOBBY!
				
				for(var i in Lobby.list[i].players){
					SOCKET_LIST[data.id].emit('addLobbyPlayer',{
						player:Player.list[i],
					});
				}	
				
				return;
			}
		}
			
	});
	
	//LOBBY CREATION STUFF
	socket.on('createNewLobby', function(data){
		var lobby = Lobby();
		Lobby.AddPlayer(lobby.id, data.creatorId);
		Player.list[data.creatorId].lobby = lobby;
		Player.list[data.creatorId].partyLeader = true;
		for(var i in SOCKET_LIST){	
			Asocket = SOCKET_LIST[i];
			if(Player.list[i].lobby != null && Player.list[i].lobby.id == lobby.id){
				Asocket.emit('lobbyJoin', {
					id:data.creatorId,
					lobby:lobby,
					leader:true,
				});
			}
		}
		console.log(Player.list[data.creatorId].id + " just joined " + lobby.id);
		//console.log("So players lobby is now " + Player.list[data.creatorId].lobby.name);
		
	});
	
	//On player "battle" -ready click
	//If all players ready: Display for party leader!
	socket.on('goBattle',function(data){
		if(Player.list[data.id].readyGoBattle != true){
			Player.list[data.id].readyGoBattle = true;
			//console.log(Player.list[data.id].id + " is now ready for battle!");
			for(var i in SOCKET_LIST){
				Asocket = SOCKET_LIST[i];
				if(Asocket.id == data.id){
					Asocket.emit('confirmGoBattle', {
						id:data.id,
					});
				}
				
			}
			//console.log(Player.list[data.id].id + " is now ready for battle!");
		}
		
		//console.log("ARE PLAYERS READY?!");
		if(!Lobby.ArePlayersGoReady([Player.list[data.id].lobby.id])){
			console.log("ALL PLAYERS ARE NOT READY!");
			return;
			
		}
		
		console.log("All players ARE ready!");
		for(var i in SOCKET_LIST){
			Asocket = SOCKET_LIST[i];
			Asocket.emit('allPlayersReady', {	
			});
		}

		//console.log(Player.list[data.id].id + " is now ready for battle!");
	});
	
	//Battle starting 
	socket.on('startBattle', function(data){
		//console.log("startBattle received from: " + data.sender);
		if(!Lobby.ArePlayersGoReady([Player.list[data.sender].lobby.id])){
			//console.log("ALL PLAYERS ARE NOT READY!");
			return;
		}
		//console.log("ALL PLAYERS ARE READY, lets battle!");
		if(Player.list[data.sender].partyLeader && Player.ArePlayersGoReadyLobby(data.sender)){
		createBattle(data.difficulty, Player.list[data.sender].lobby.id);
			for(var i in SOCKET_LIST){
				Asocket = SOCKET_LIST[i];
				for(var i in Player.list[data.sender].lobby.players){
					//console.log("Searching through players in lobby " + Player.list[data.sender].lobby.id+ " and sending them to battle!");
					if(Player.list[data.sender].lobby.players[i] == Asocket.id){
						Asocket.emit('battleTransition');
						//console.log("Found such a player!");					
						}
					}
				}	
			}
	});
	
	//Attack click in battle THIS IS PLAYER ATTACK
	socket.on("atk", function(data){
		console.log(data);
		//Create a new attack with attacker + target
		var attack = Attack({
			attacker:Player.list[data.id],
			target:Enemy.list[Player.list[data.id].target]
		});
		
		
		//Apply this attack
		Attack.ApplyAttack(attack.id, attack.Attacker, attack.Target);
		
		//If the attack was a success (had target, hit, etc) send confirmation to clients
		console.log("emitting " + attack.message);
		if(Attack.list[attack.id].success){
			for(var i in SOCKET_LIST){
				var Asocket = SOCKET_LIST[i];
				Asocket.emit("atkConfirm", {
					player:data.id,
					target:attack.Target.id,	
					damage:attack.message,
				});
			}
		}
		
		//If the attack killed the target, send enemyDeath to clients
		if(Attack.list[attack.id].didKill){
			for(var i in SOCKET_LIST){
				var Asocket = SOCKET_LIST[i];
					Asocket.emit("enemyDeath", {
						id:attack.Target.id,							
				});
			}		
		}		
		
		//After every attack, check if all enemies are dead 
		//console.log("Checking if all enemies are deaD " + Lobby.AreEnemiesDead(Player.list[data.id].lobby.id));
		//console.log("checked lobby is  " + Player.list[data.id].lobby.id);
		if(Lobby.AreEnemiesDead(Player.list[data.id].lobby.id)){
			//console.log("All enemies dead, display rewards");
			createRewards(Player.list[data.id].lobby.id);
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
				console.log("enemy count from " + Player.list[data.id].lobby.id);
				if(Lobby.AliveEnemyCount(Player.list[data.id].lobby.id) == 1){
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
					createRewards(Player.list[data.id].lobby.id);
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
		
		//console.log("Checking if all players are ready?");
		if(!Lobby.ArePlayersReady(data.lobby.id)){
			//console.log("All players are not ready in lobby " + data.lobby.id);
			return;
		}
		
		//Player turn is over, set players to have max ap and not be ready
		console.log("something " + data.lobby + " and " + data.lobby.id);
		console.log("Maxing out player ap " + Player.list[i].lobby + " and " + Lobby.list[i]);
		for(var i in Lobby.list[data.lobby.id].players){
			console.log("Maxing out player ap " + Player.list[i].lobby + " and " + Lobby.list[i]);
			if(Player.list[i].lobby.id == Lobby.list[data.lobby.id].id){
				Player.list[i].ready = false;		
				Player.list[i].APCurrent = Player.list[i].APMax;
			}
		}
			
		
		Lobby.list[data.lobby.id].playerTurn = false;
		//console.log("All players are ready, initiate enemy behavior!");
		initiateEnemyBehavior(data.lobby.id);	
	});
	
	//Selection in battle
	socket.on("selection", function(data){
		//console.log("Player " + data.player + " selected " + data.target);
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
			
			Player.ApplySoulBonuses(Player.list[data.id].id);
			
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
	
	for(var i in Lobby.list){
		if(!Lobby.list[i].playerTurn){
			Lobby.list[i].enemyTimer++;
			if(Lobby.list[i].enemyTimer == 80 && !Lobby.AreEnemiesReady(Lobby.list[i].id)){
				console.log("New enemy round!");
				initiateEnemyBehavior(Lobby.list[i].id);
			}
			else if(Lobby.list[i].enemyTimer == 80){
				console.log("Player turn!");
				
				//Apple all player turn skills!
				for(var j in Lobby.list[i].players){
						Player.list[j].ApplyAllTurnSkills(Player.list[j]);
						for(var h in SOCKET_LIST){
							var Asocket = SOCKET_LIST[h];
							if(Player.list[Asocket.id].lobby != null && Player.list[Asocket.id].lobby.id == Player.list[j].lobby.id){
								Asocket.emit('turnSkillMessage', {
									message:Player.list[j].message,
									id:Player.list[j].id,
								});
								Player.list[j].message ="";
							}			
					}
				}
				
				for(var j in SOCKET_LIST){
					var socket = SOCKET_LIST[j];
					for(var h in Lobby.list[i].players){
						if(socket.id == Lobby.list[i].players[h])
							socket.emit('playerTurn', {
								lobbyId: Lobby.list[i].id,
							});
					}
				}
				//Set all enemies to have max ap
				for(var j in Lobby.list[i].enemies){
					//console.log(Enemy.list[j].lobby.id + " that is enemy lobby id, current lobby is " + Lobby.list[i].id);
					if(Enemy.list[j].lobby.id == Lobby.list[i].id)
						Enemy.list[j].APCurrent = Enemy.list[j].APMax;
				}
				//Set all players to have max ap and be ready
				/*for(var j in Player.list){
					if(Player.list[j].lobby == Lobby.list[i]){
						Player.list[j].ready = false;		
						Player.list[j].APCurrent = Player.list[j].APMax;
					}		
				}*/
			}
		}
	}
}, 1000/25);

//THIS IS ENEMY ATTACK
function initiateEnemyBehavior(lobbyId){
	Lobby.list[lobbyId].enemyTimer = 0;
	var playerAmount = Player.getPlayerCount();
	
	//Make enemies use their turnskills in battle! (Vital)
	for(var i in Lobby.list[lobbyId].enemies){
		Enemy.list[i].ApplyAllTurnSkills(Enemy.list[i]);
		for(var j in SOCKET_LIST){
			var Asocket = SOCKET_LIST[j];
			console.log(j + " hmm");
			if(Player.list[Asocket.id].lobby != null && Player.list[Asocket.id].lobby.id == Enemy.list[i].lobby.id){
				Asocket.emit('turnSkillMessage', {
					message:Enemy.list[i].message,
					id:Enemy.list[i].id,
				});
				Enemy.list[i].message ="";
			}			
		}
	}
	
	console.log("Initiating enemy behaviour in lobby " + lobbyId);
	for(var i in Lobby.list[lobbyId].enemies){
				Enemy.list[i].target = Player.list[Lobby.GetRandomPlayer(lobbyId)];
				var attack = Attack({
					attacker:Enemy.list[Lobby.list[lobbyId].enemies[i]],
					target:Enemy.list[i].target,
				});
				
				//Test for taunts!
				attack.Attacker.currentAttackID = attack.id;
				for(var j in Lobby.list[lobbyId].players){
					if(Lobby.list[lobbyId].players[j] != attack.Target.id){
						console.log("Checking for taunt on an attack...");
						Player.list[Lobby.list[lobbyId].players[j]].ApplyTaunt(attack.Attacker, attack.Target);
						console.log(Lobby.list[lobbyId].players[j] + " checked for this?");
						console.log(Player.list[Lobby.list[lobbyId].players[j]].id + " just confirming ^");
					}
				}
				
				//console.log("The damage of the attack by the attacker of this attack is..." + attack.Attacker.currentAttack.damage);
				
				//Apply this attack
				Attack.ApplyAttack(attack.id, attack.Attacker, attack.Target);
				
				if(attack.success){
					var eIdToSend = Enemy.list[i].id;
					var tIdToSend = Enemy.list[i].target.id;
					for(var i in SOCKET_LIST){
						var socket = SOCKET_LIST[i];
						if(Player.list[socket.id].lobby != null && Player.list[socket.id].lobby.id == lobbyId){
							socket.emit('enemyAttack', {
								//This is kind of weird at the moment, attack is emitted only for testing
								//Basically attack contains info of attacker and target so they are useless once refactored
								enemyID: eIdToSend,
								targetID: tIdToSend,
								attack:attack,
							});
						}
					}
				}
	}
}

function createBattle(difficulty, lobbyId){
	//Create enemies for battle
	var enemyAmount = Math.floor(Math.random() * (3-1)+1);
	for(var i = 0; i < enemyAmount; i++){
		var enemy = Enemy.Create(difficulty, Lobby.list[lobbyId]);	
		Lobby.AddEnemy(lobbyId, enemy.id);
		
	}
	//Set all enemies readyGoBattle false
	for(var i in Player.list){
		if(Player.list[i].lobby != null && Player.list[i].lobby.id == lobbyId){
			Player.list[i].readyGoBattle = false;
			Player.list[i].APCurrent = Player.list[i].APMax;
		}
	}
}

//FUNCTION TO CREATE REWARDS AFTER A BATTLE
function createRewards(lobbyId){
	var experienceReward=0;
	var goldReward=0;
	
	//Create rewards for each enemy based on their stats
	for(var i in Enemy.list){
		if(Enemy.list[i].lobby.id == lobbyId){
			experienceReward += Enemy.list[i].healthMax + Enemy.list[i].APMax + Enemy.list[i].dieSize*2 + Enemy.list[i].dieAmount*5;
			goldReward += Enemy.list[i].healthMax/5 + Enemy.list[i].APMax/5 + Enemy.list[i].dieSize + Enemy.list[i].dieAmount*2;
		}
	}
	//Floor rewards, wait 2000ms and send rewards to players
	bodyExpReward = Math.floor(experienceReward);
	soulExpReward = Math.floor(experienceReward/2);
	goldReward = Math.floor(goldReward);
	
	console.log("Rewarding all Players with " + bodyExpReward + " experience and " + goldReward + " gold!");
	
	//Go through every player and check for level ups/bodylevel ups
	for(var i in Player.list){
		if(Player.list[i].lobby.id == lobbyId){
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
					Player.ApplySoulBonuses(Player.list[i].id);
					console.log("Player leveled up!");
					
				}else{
					leveling = false;
					console.log("Player didnt level up!" + Player.list[i].experience +" / "+ Math.floor(XPBASE*(Math.pow(Player.list[i].level, XPFACTOR))));
				}
			}
			
			leveling = true;
			if(!Player.list[i].didSnatch && Player.list[i].bodyLevel < Player.list[i].body.maxLevel){
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
						Player.ApplySoulBonuses(Player.list[i].id);
						console.log("Players body leveled up, body has level bonuses of " + Player.list[i].body.levelBonuses[0] +"/"+ Player.list[i].body.levelBonuses[1] +"/"+ Player.list[i].body.levelBonuses[2]+"/"+ Player.list[i].body.levelBonuses[3]);
					}else{
						leveling = false;
						console.log("Players body didnt level up!" + Player.list[i].bodyExperience +" / "+ Math.floor(XPBASE*(Math.pow(Player.list[i].bodyLevel, XPFACTOR))));
					}
				}
			}else{
				Player.list[i].didSnatch = true; //A work around for not receiving xp after max level, rename didSnatch to something later...
				console.log("Player snatched a body so he is not given any body xp from this battle!");
			}
			Player.list[i].gold += goldReward;
		}
	}
	
	setTimeout(function(){
		for(var i in SOCKET_LIST){
			
			var socket = SOCKET_LIST[i];
			//console.log("Does " + Player.list[socket.id].lobby.id + " equal " + lobbyId + "?");
			if(Player.list[socket.id].lobby.id == lobbyId){

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
			
		}
		console.log("Rewards sent to players, ready to clear out enemies!");
		
		//Enemy.ClearEnemyList(lobbyId);
		
		for(var i in Lobby.list[lobbyId].enemies){
			delete Enemy.list[Lobby.list[lobbyId].enemies[i]];
			console.log("Enemy " + Lobby.list[lobbyId].enemies[i] + " removed!");
		}
		
		Lobby.list[lobbyId].enemies = [];
		console.log("Lobby " + lobbyId + " enemies cleared!");
		Enemy.ClearInitPack();
		initPack.EnemyInitPack = [];
	}, 2000);
	
	
}