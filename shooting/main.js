enchant();
window.onload=function(){
  var game=new Game(320, 320);
  game.preload('chara1.gif', 'chara2.gif','icon0.gif');
  game.onload=function(){
  	var player=new Sprite(32,32);
  	player.image=game.assets['chara1.gif'];
  	game.rootScene.addChild(player);
  	var enemies = [];
  	game.rootScene.addEventListener('enterframe', function(){
  		if(Math.random() < 0.1){
		  	var enemy=new Sprite(32, 32);
		  	enemy.image=game.assets['chara2.gif'];
		  	enemy.x = 320 - 32;
		  	enemy.y = (320 - 32) * Math.random();
		  	game.rootScene.addChild(enemy);
		  	enemy.addEventListener('enterframe', function(){
		  		this.x -= 2;
		  		if(player.intersect(this)){
		  			game.stop();
		  			var label = new Label('GAME OVER');
					label.font = '32px sans-serif';
					label.x = 50;
					label.y = 150;
					game.rootScene.addChild(label);
		  		}
		  	});
		  	enemies.push(enemy);
  		}
  	});
  	var label = new Label("SCORE:0");
  	game.rootScene.addChild(label);
  	var score = 0;
  	game.rootScene.addEventListener('touchstart', function(e){
  		player.y=e.y;
  		var missile=new Sprite(16,16);
  		missile.image=game.assets['icon0.gif'];
  		missile.frame=54;
  		missile.x=player.x;
  		missile.y=player.y;
  		missile.addEventListener('enterframe',function(){
  			this.x += 2;
  			for(var i = 0; i < enemies.length; i++){
	  			if(enemies[i].intersect(this)){
	  				game.rootScene.removeChild(enemies[i]);
	  				game.rootScene.removeChild(this);
	  				enemies.splice(i, 1);
	  				score++;
	  				label.text = "SCORE:" + score;
	  				break;
	  			}
  			}
  		});
  		game.rootScene.addChild(missile);
  	});
  };
  game.start();
};