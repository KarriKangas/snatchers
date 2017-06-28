const floatSpeed = -1;

var floatingStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 21,
	fontWeight: 'bold',
	fill: '#FF0000',
	align: 'center',
	/*dropShadow: true,
	dropShadowColor: '#FFFFFF',
	dropShadowDistance: 1,*/
});

var FloatingText = function(param){
	instance = {};
	instance.id = Math.random();
	instance.lobby = param.lobby;
	instance.message = param.message;
	instance.x = param.x;
	instance.y = param.y;

	
	instance.FloatingText = new PIXI.Text(instance.message, floatingStyle);
	instance.FloatingText.x = instance.x;
	instance.FloatingText.y = instance.y;
	
	if(param.color){
		instance.color = param.color;
		instance.FloatingText.style.fill = instance.color;
	}else{
		instance.FloatingText.style.fill = '#FF0000';
	}
	
	FloatingText.list[instance.id] = instance;
	pixi.stage.addChild(instance.FloatingText);	
	return instance;
	
}
	
FloatingText.list = {};

FloatingText.MoveTexts = function(){
	for(var i in FloatingText.list){
		//console.log(Player.list[selfId].lobby.id);
		//console.log("and " + FloatingText.list[i].lobby);
		if(Player.list[selfId].lobby.id == FloatingText.list[i].lobby){
			FloatingText.list[i].FloatingText.y += floatSpeed;
			FloatingText.list[i].y += floatSpeed;
			
			//Quick fix for rendering text in front of sprites
			//Might be straining cpu removing+adding every text every frame..?
			//If problems, look into adding a "text" canvas infront of actual game canvas
			pixi.stage.removeChild(FloatingText.list[i].FloatingText);
			pixi.stage.addChild(FloatingText.list[i].FloatingText);	
			
			
			if(FloatingText.list[i].y < -20){
				pixi.stage.removeChild(FloatingText.list[i].FloatingText);
				delete FloatingText.list[i];
			}
		}
	}
	
}