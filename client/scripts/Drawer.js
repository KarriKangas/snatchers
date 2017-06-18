var Drawer = function(){
	
	
	
}
		
	//BATTLE
	var Atkbutton = PIXI.Sprite.fromImage('client/img/Battle/AtkButton.png');
	var Invbutton = PIXI.Sprite.fromImage('client/img/Battle/InvButton.png');
	var Skillbutton = PIXI.Sprite.fromImage('client/img/Battle/SkillButton.png');
	var Snatchbutton = PIXI.Sprite.fromImage('client/img/Battle/SnatchButton.png');
	var BottomBar = PIXI.Sprite.fromImage('client/img/Battle/BottomBar.png');
	//var PlayerSprite = PIXI.Sprite.fromImage('client/img/Battle/Player.png');
	var EnemySprite = PIXI.Sprite.fromImage('client/img/Battle/Enemy.png');
	var DeadEnemySprite = PIXI.Sprite.fromImage('client/img/Battle/EnemyDead.png');
	var Rdybutton = PIXI.Sprite.fromImage('client/img/Battle/ReadyButton.png');
		
	//BATTLE REWARDS
	var RewardPanel = PIXI.Sprite.fromImage('client/img/Battle/Rewards.png');
	var RewardContinue = PIXI.Sprite.fromImage('client/img/Battle/ContinueButton.png');
		
	//MENU
	var background = PIXI.Sprite.fromImage('client/img/Menu/Background.png');
	var leftBar = PIXI.Sprite.fromImage('client/img/Menu/LeftBar.png');
	var buttonTemp = PIXI.Sprite.fromImage('client/img/Menu/ButtonTemplate.png');
		
	var CharacterButton = PIXI.Sprite.fromImage('client/img/Menu/CharacterButton.png');
	var MenuInvButton = PIXI.Sprite.fromImage('client/img/Menu/InventoryButton.png');
	var PartyButton = PIXI.Sprite.fromImage('client/img/Menu/PartyButton.png');
	var BattleButton = PIXI.Sprite.fromImage('client/img/Menu/BattleButton.png');
	var EasyButton = PIXI.Sprite.fromImage('client/img/Menu/EasyButton.png');
	var MediumButton = PIXI.Sprite.fromImage('client/img/Menu/MediumButton.png');
	var HardButton = PIXI.Sprite.fromImage('client/img/Menu/HardButton.png');
		
	//CHAR Menu
	var CharBlock1 = PIXI.Sprite.fromImage('client/img/Menu/Char/CharBlock.png');
	var CharBlock2 = PIXI.Sprite.fromImage('client/img/Menu/Char/CharBlock.png');
	var CharBlock3 = PIXI.Sprite.fromImage('client/img/Menu/Char/CharBlock.png');
	var CharImage = PIXI.Sprite.fromImage('client/img/Menu/Char/NoImage.png');
	var CharBackButton =  PIXI.Sprite.fromImage('client/img/Menu/BackButton.png');
	
	//RELEASE RELATED UI
	var ReleaseButton =  PIXI.Sprite.fromImage('client/img/Menu/Char/ReleaseButton.png');
	var NoButton =  PIXI.Sprite.fromImage('client/img/Menu/Char/NoButton.png');
	var YesButton =  PIXI.Sprite.fromImage('client/img/Menu/Char/YesButton.png');
	
	//RELEASE PANEL IS THE CONFIRMATION OF RELEASE
	var ReleasePanel =  PIXI.Sprite.fromImage('client/img/Menu/Char/ReleasePanel.png');
	//RESET PANEL IS WHERE THE ACTUAL STAT CHANGING HAPPENS
	var ResetPanel =  PIXI.Sprite.fromImage('client/img/Menu/Char/ResetPanel.png');
	
	var PlusButton =  PIXI.Sprite.fromImage('client/img/Menu/Char/PlusButton.png');
	var MinusButton =  PIXI.Sprite.fromImage('client/img/Menu/Char/MinusButton.png');
	
	
		//TEXT STYLES HERE
	var healthStyle = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 14,
		fontWeight: 'bold',
		fill: '#FFFFFF'
	});
		
	var menuStyle = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 16,
		fontWeight: 'bold',
		fill: '#000000'
	});
		
	//TEXTS
	var turnText = new PIXI.Text('', healthStyle);
	var goBattleText = new PIXI.Text('', healthStyle);
	var goBattleReadyText = new PIXI.Text('', healthStyle);
	var partyLeaderText = new PIXI.Text('',healthStyle);
	var chooseDifText = new PIXI.Text('',healthStyle);
	var leaderChoosingText = new PIXI.Text('',healthStyle);
	var rewardText = new PIXI.Text('',healthStyle);
		
	//CHAR MENU TEXTS
	var bodyText = new PIXI.Text('', menuStyle);
	var soulText = new PIXI.Text('', menuStyle);
	var totalText = new PIXI.Text('', menuStyle);
	//RELEASE TEXTS
	var ReleaseText = new PIXI.Text('', menuStyle);
	var Reset = new PIXI.Text('', menuStyle);	
	
	//MENU BUTTONS
	BattleButton.on('pointerdown', () => {
		socket.emit('goBattle', {
			id:selfId,
		});			
	});
	
	CharacterButton.on('pointerdown', () => {
		Drawer.initChar();		
	});
			
	CharBackButton.on('pointerdown', () => {
		Drawer.initMenu();		
	});
	
	ReleaseButton.on('pointerdown',() => {
		Drawer.initReleaseConfirm();
	});
	
	YesButton.on('pointerdown',() => {
		Drawer.initReset();
	});
	
	NoButton.on('pointerdown',() => {
		Drawer.initChar();
	});
	
	EasyButton.on('pointerdown', () => {
		socket.emit('startBattle',{
			sender:selfId,
			difficulty: 1,
		});		
	});
			
	MediumButton.on('pointerdown', () => {
		socket.emit('startBattle',{
			sender:selfId,
			difficulty: 2,
		});
	});
			
	HardButton.on('pointerdown', () => {
		socket.emit('startBattle',{
			sender:selfId,
			difficulty: 3,
		});
	});
	
	//BATTLE BUTTONS
	Rdybutton.on('pointerdown', () => {
		if(playerTurn){
			socket.emit('rdy',{
				id:selfId
			});			
		}
	});	
	
	Atkbutton.on('pointerdown', () => {
		if(playerTurn && !Player.list[selfId].attacking){
			socket.emit('atk',{
				id:selfId
			});
		}		
	});
	
	Snatchbutton.on('pointerdown', () => {
		if(playerTurn){
			socket.emit('snatch',{
				id:selfId
			});
		}		
	});
	
	//AFTER BATTLE BUTTONS
	RewardContinue.on('pointerdown', () => {
		Drawer.initMenu();
		Player.list[selfId].inBattle = false;
		Player.list[selfId].inRewards = false;
		Player.list[selfId].inMenu = true;
		Enemy.list = {};
	});
	
	/*Skillbutton.on('pointerdown', () => {
		if(playerTurn){
			socket.emit('skill',{
				id:selfId
			});
		}	
	});		
	
	Invbutton.on('pointerdown', () => {
		if(playerTurn){
			socket.emit('inv',{
				id:selfId
			});			
		}
	});*/

		Drawer.drawBattle = function(){
		for(var i in Player.list){

				if(!Player.list[i].attacking){
					Player.list[i].Sprite.x = 100;
					Player.list[i].Sprite.y = 50+100*Player.getPlayerListPosition(Player.list[i].id);
					
					pixi.stage.addChild(Player.list[i].Sprite);
					
					Player.list[i].healthText.x = 25;
					Player.list[i].healthText.y = 25+100* Player.getPlayerListPosition(Player.list[i].id);
					Player.list[i].healthText.fill = '#FFFFFF';
					
					pixi.stage.addChild(Player.list[i].Sprite);
					pixi.stage.addChild(Player.list[i].healthText);
				}
			}

			for(var i in Enemy.list){
				//console.log(counter);
				if(!Enemy.list[i].attacking){
					Enemy.list[i].Sprite.x = 700;
					Enemy.list[i].Sprite.y = 50+100*Enemy.getEnemyListPosition(Enemy.list[i].id);
					
				pixi.stage.addChild(Enemy.list[i].Sprite);
				
				Enemy.list[i].healthText.x = 650;
				Enemy.list[i].healthText.y = 50+100*Enemy.getEnemyListPosition(Enemy.list[i].id);
				Enemy.list[i].healthText.fill = '#FFFFFF';
				
				pixi.stage.addChild(Enemy.list[i].Sprite);
				pixi.stage.addChild(Enemy.list[i].healthText);
				
				}
			}
			
		
			for(var i in Player.list){
				if(Player.list[i].attacking){
				//console.log("animating player " + Player.list[i].attackFrame);
					if(Player.list[i].attackFrame < 30){
						Player.onPlayerInfoChange(Player.list[i].id);
						Player.list[i].Sprite.x += 15;
						Player.list[i].Sprite.y -= (Player.list[i].Sprite.y - Enemy.list[Player.list[i].target].Sprite.y)/30
						Player.list[i].attackFrame++;
					}
					else if(Player.list[i].attackFrame >= 30 && Player.list[i].attackFrame < 60){
						Player.list[i].Sprite.x -= 15;
						Player.list[i].Sprite.y += (Player.list[i].Sprite.y - Enemy.list[Player.list[i].target].Sprite.y)/30
						Player.list[i].attackFrame++;
						Enemy.onEnemyInfoChange(Player.list[i].target);
					}
					else if(Player.list[i].attackFrame >= 60) {
					Player.list[i].attacking = false;
					Player.list[i].attackFrame = 0;					
					}
				}			
			}
			
			enemyTimer++;
			//ENEMY ACTIONS HERE
			for(var i in Enemy.list){
			
				if(Enemy.list[i].attacking){
					if(Enemy.list[i].currentWait > 0)
						Enemy.list[i].currentWait--;
				
					if(Enemy.list[i].currentWait <= 0){
					//console.log("animating enemy " + Enemy.list[i].attackFrame);
					//ASK SERVER FOR ANIMATION
						if(Enemy.list[i].attackFrame < 30){
							Enemy.list[i].Sprite.x -= 15;
							Enemy.list[i].Sprite.y -= (Enemy.list[i].Sprite.y - Player.list[Enemy.list[i].target].Sprite.y)/30
							Enemy.list[i].attackFrame++;
						}
					//ASK SERVER FOR UPDATED HEALTH NUMBERS + DAMAGE
						else if(Enemy.list[i].attackFrame >= 30 && Enemy.list[i].attackFrame < 60){
							Enemy.list[i].Sprite.x += 15;
							Enemy.list[i].Sprite.y += (Enemy.list[i].Sprite.y - Player.list[Enemy.list[i].target].Sprite.y)/30
							Enemy.list[i].attackFrame++;
							Player.onPlayerInfoChange(Enemy.list[i].target);
						}
						else if(Enemy.list[i].attackFrame >= 60) {
								Enemy.list[i].currentWait = Enemy.list[i].waitTime;
								Enemy.list[i].attacking = false;
								Enemy.list[i].attackFrame = 0;	
								Enemy.onEnemyInfoChange(Enemy.list[i].id);
							}						
						}
					}	
				}
		}
		
		Drawer.initMenu = function(){
			Player.list[selfId].inMenuChar = false;
			for (var i = pixi.stage.children.length - 1; i >= 0; i--){	
				pixi.stage.removeChild(pixi.stage.children[i]);		
			}
			background.anchor.set(0.1);
			background.x = 0;
			background.y = 0;
			pixi.stage.addChild(background);
			
			leftBar.anchor.set(0.5);
			leftBar.x = 25;
			leftBar.y = 0;
			pixi.stage.addChild(leftBar);
			
			goBattleText.text = ('Players ready to battle: (' + Player.getGoReadyCount() + "/" + Player.getPlayerCount() + ")");
			goBattleText.x = 5;
			goBattleText.y = 500;
			pixi.stage.addChild(goBattleText);
			
			goBattleReadyText.text = ('');
			goBattleReadyText.x = 5;
			goBattleReadyText.y = 525;
			pixi.stage.addChild(goBattleReadyText);
			
			partyLeaderText.text = ('');
			partyLeaderText.x = 5;
			partyLeaderText.y = 550;
			pixi.stage.addChild(partyLeaderText);
			
			leaderChoosingText.text = ('');
			leaderChoosingText.x = 375;
			leaderChoosingText.y = 175;
			pixi.stage.addChild(leaderChoosingText);
			
			chooseDifText.text = ('');
			chooseDifText.x = 375;
			chooseDifText.y = 50;
			pixi.stage.addChild(chooseDifText);
			
			var menuUIButtons = [
				CharacterButton,
				MenuInvButton,
				PartyButton,
				BattleButton				
			]
			
			var difficultyButtons = [
				EasyButton,
				MediumButton,
				HardButton,
			
			]
			
			for(var i = 0; i < menuUIButtons.length; i++){
				menuUIButtons[i].interactive = true;
				menuUIButtons[i].buttonMode = true;
				menuUIButtons[i].anchor.set(0.5);
				menuUIButtons[i].x = 100;
				menuUIButtons[i].y = 75+125*i;
				pixi.stage.addChild(menuUIButtons[i]);
			}	
			
			if(Player.list[selfId].partyLeader){
				for(var i = 0; i < difficultyButtons.length; i++){
					difficultyButtons[i].interactive = true;
					difficultyButtons[i].buttonMode = true;
					difficultyButtons[i].anchor.set(0.5);
					difficultyButtons[i].x = 500;
					difficultyButtons[i].y = 125+125*i;
					pixi.stage.addChild(difficultyButtons[i]);
				}	
				chooseDifText.text = "Choose an adventure for your party";
			}else{
				leaderChoosingText.text = "Party leader is choosing an adventure...";
			}
			menuInited = true;
			battleInited = false;
		}
		
		Drawer.drawMenu = function(){
			if(Player.list[selfId].readyToBattle){
				goBattleReadyText.text = ('You are ready to battle!');
			}
			
			if(Player.list[selfId].partyLeader)
				partyLeaderText.text = ('You are the party leader');
			else{
				partyLeaderText.text = ('Party leader is: P' + (Player.getPartyLeaderId().toString()).substring(2,5));
			}
				
			goBattleText.text = ('Players ready to battle: (' + Player.getGoReadyCount() + "/" + Player.getPlayerCount() + ")");
		
		}
		
		Drawer.initRewards = function(rewards){
			Player.list[selfId].inRewards = true;
			Player.list[selfId].attacking = false;
			Player.list[selfId].target = null;
			Player.list[selfId].APCurrent = Player.list[selfId].APMax;
			for (var i = pixi.stage.children.length - 1; i >= 0; i--){	
					pixi.stage.removeChild(pixi.stage.children[i]);		
			}
			
			RewardPanel.anchor.set(0.5);
			RewardPanel.x = 375;
			RewardPanel.y = 250;
			pixi.stage.addChild(RewardPanel);
			
			RewardContinue.interactive = true;
			RewardContinue.buttonMode = true;
			RewardContinue.anchor.set(0.5);
			RewardContinue.x = 375;
			RewardContinue.y = 325;
			pixi.stage.addChild(RewardContinue);
			
			rewardText.text = "         Victory!\nExperience earned: " + rewards[0] + "\nGold earned: " + rewards[1];
			rewardText.x = 325;
			rewardText.y = 150;
			pixi.stage.addChild(rewardText);
			
			for(var i in Player.list){
				Player.onPlayerInfoChange(Player.list[i].id);
			}
			
		}
		
	Drawer.initChar = function(){
		Player.list[selfId].inMenu = false;
		Player.list[selfId].inMenuChar = true;
		
		for (var i = pixi.stage.children.length - 1; i >= 0; i--){	
			pixi.stage.removeChild(pixi.stage.children[i]);		
		}
		
		CharBlock1.anchor.set(0.5);
		CharBlock1.x = 133;
		CharBlock1.y = 300;
		pixi.stage.addChild(CharBlock1);
		
		CharBlock2.anchor.set(0.5);
		CharBlock2.x = 399;
		CharBlock2.y = 300;
		pixi.stage.addChild(CharBlock2);
		
		CharBlock3.anchor.set(0.5);
		CharBlock3.x = 665;
		CharBlock3.y = 300;
		pixi.stage.addChild(CharBlock3);
		
		CharImage.anchor.set(0.5);
		CharImage.x = 133;
		CharImage.y = 100;
		pixi.stage.addChild(CharImage);
		
		console.log("for Player " + selfId + " ----- " +Player.list[selfId].bodyLevel + " is bodylevel " + Player.list[selfId].bodyExperience + " is bodyexp" );
		var Body = Player.list[selfId].body;
		bodyText.text = "BODY STATS"
		+"\nDamage: " + (Body.dieAmount + (Player.list[selfId].bodyLevel*Body.levelBonuses[3])) + "d" + (Body.dieSize + (Player.list[selfId].bodyLevel*Body.levelBonuses[2]))
		+"\nHealth: " + (Player.list[selfId].body.healthMax + (Player.list[selfId].bodyLevel*Body.levelBonuses[0]))
		+"\nAction Points: " + (Body.APMax + (Player.list[selfId].bodyLevel*Body.levelBonuses[1]))
		+"\nBody level: " + Player.list[selfId].bodyLevel + "/" + Body.maxLevel
		+"\nBody experience: " + Player.list[selfId].bodyExperience + "/" + Math.floor(50*(Math.pow(Player.list[selfId].bodyLevel, 2.5)))
		+"\n\n---Everything else---";
		bodyText.x = 34;
		bodyText.y = 200;
		pixi.stage.addChild(bodyText);
		

		soulText.text = "SOUL STATS"
		+"\nSoul Level: " + Player.list[selfId].level
		+"\nSoul experience: " + Player.list[selfId].experience + "/" +  Math.floor(50*(Math.pow(Player.list[selfId].level, 2.5)))
		+"\nDamage: + "+ Player.list[selfId].soulDamage*100 +"%"
		+"\nHealth: + "+ Player.list[selfId].soulHealth*100 +"%"
		+"\nAction Points: + "+ Player.list[selfId].soulAP*100 +"%"
		+"\n\n---Everything else---";
		soulText.x = 300;
		soulText.y = 25;
		pixi.stage.addChild(soulText);
		

		totalText.text = "TOTAL STATS"
		+"\nDamage: " + (Body.dieAmount + (Player.list[selfId].bodyLevel*Body.levelBonuses[3])) + "d" + (Body.dieSize + (Player.list[selfId].bodyLevel*Body.levelBonuses[2]) + Player.list[selfId].soulDamage*100 +"%")
		+"\nHealth: " + (Player.list[selfId].body.healthMax + (Player.list[selfId].bodyLevel*Body.levelBonuses[0])+ Player.list[selfId].soulHealth*100 +"%")
		+"\nAction Points: " + (Body.APMax + (Player.list[selfId].bodyLevel*Body.levelBonuses[1])+ Player.list[selfId].soulAP*100 +"%")
		+"\n\nGold: " + Player.list[selfId].gold
		+"\n\n---Everything else---";
		totalText.x = 566;
		totalText.y = 25;
		pixi.stage.addChild(totalText);
		
		CharBackButton.interactive = true;
		CharBackButton.buttonMode = true;
		CharBackButton.anchor.set(0.5);
		CharBackButton.x = 133;
		CharBackButton.y = 550;
		pixi.stage.addChild(CharBackButton);
		
		ReleaseButton.interactive = true;
		ReleaseButton.buttonMode = true;
		ReleaseButton.anchor.set(0.5);
		ReleaseButton.x = 399;
		ReleaseButton.y = 550;
		pixi.stage.addChild(ReleaseButton);
		
		console.log(Player.list[selfId].body.name + " what?");
		console.log(Player.list[selfId].dieAmount + " what?");
		console.log(Player.list[selfId].dieSize + " what?");
		console.log(Player.list[selfId].healthMax + " what?");
		
	}
	
	Drawer.initBattle = function(){
			for (var i = pixi.stage.children.length - 1; i >= 0; i--){	
				pixi.stage.removeChild(pixi.stage.children[i]);		
			}
			turnText.text = ('Turn: Players');
			turnText.x = 300;
			turnText.y = 5;
			pixi.stage.addChild(turnText);
		
			BottomBar.anchor.set(0.5);
			BottomBar.x = 300;
			BottomBar.y = 550;
			pixi.stage.addChild(BottomBar);
			
			var BattleUIbuttons = [
				Atkbutton,
				Skillbutton,	
				Invbutton,
				Rdybutton,
				Snatchbutton,
			]
			
			for(var i = 0; i < BattleUIbuttons.length; i++){
					BattleUIbuttons[i].interactive = true;
					BattleUIbuttons[i].buttonMode = true;
					BattleUIbuttons[i].anchor.set(0.5);
					BattleUIbuttons[i].x = 100 + i*150;
					BattleUIbuttons[i].y = 500;
					pixi.stage.addChild(BattleUIbuttons[i]);
			}		
			battleInited = true;
			menuInited = false;
			for(var i in Player.list){
				Player.onPlayerInfoChange(Player.list[i].id);
			}
		}
		
	Drawer.initReleaseConfirm = function(){
		ReleasePanel.anchor.set(0.5);
		ReleasePanel.x = 400;
		ReleasePanel.y = 300;
		pixi.stage.addChild(ReleasePanel);

		YesButton.interactive = true;
		YesButton.buttonMode = true;
		YesButton.anchor.set(0.5);
		YesButton.x = 350;
		YesButton.y = 375;
		YesButton.scale.x = 0.5;
		YesButton.scale.y = 0.5;
		pixi.stage.addChild(YesButton);

		NoButton.interactive = true;
		NoButton.buttonMode = true;
		NoButton.anchor.set(0.5);
		NoButton.x = 450;
		NoButton.y = 375;
		NoButton.scale.x = 0.5;
		NoButton.scale.y = 0.5;
		pixi.stage.addChild(NoButton);	
		
		ReleaseText.text = "Are you sure you wish to \nrelease your current body \nin order to distribute your \n" + Player.list[selfId].soulPoints + " soul points?";
		ReleaseText.x = 310;
		ReleaseText.y = 200;
		pixi.stage.addChild(ReleaseText);
		
		//SET BACKBUTTON TO NOT WORK
		CharBackButton.buttonMode = false;
		CharBackButton.interactive = false;
		
	}
	
	Drawer.initReset = function(){
		Reset.anchor.set(0.5);
		Reset.x = 400;
		Reset.y = 300;
		pixi.stage.addChild(Reset);
		
		
	}