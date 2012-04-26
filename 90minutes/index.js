enchant();

window.onload = function() {

  var CHARA_PATH = 'img/space3.gif';
  var MISSILE_PATH = 'img/icon0.gif';
  var GAME_OVER_PATH = 'img/gameover.png';

  var game = new Game(320, 320);
  game.fps = 24;
  game.preload(CHARA_PATH);
  game.preload(GAME_OVER_PATH);
  game.preload(MISSILE_PATH);

  game.onload = function() {

    var bear = new Sprite(32, 32);
    bear.image = game.assets[CHARA_PATH];
    bear.frame = 15;
    bear.x = 150;
    bear.y = 150;

    bear.vx = 0;
    bear.vy = 0;
    bear.speed = 5;

    bear.rotation = 0;

    bear.addEventListener('enterframe', function() {
      if (game.input.right) {
        this.vx = 1;
      }
      if (game.input.left) {
        this.vx = -1;
      }
      if (game.input.up) {
        this.vy = -1;
      }
      if (game.input.down) {
        this.vy = 1;
      }

      if (this.vx != 0 || this.vy != 0) {
        this.rotation += 20;
      }

      this.x += this.speed * this.vx;
      this.y += this.speed * this.vy;
//      if (this.within(bear2, 5)) {
//        game.stop();
//      }

      if (this.x < -this.width || this.x > game.width
            || this.y < -this.height || this.y > game.height) {
        var gameover = new Sprite(189, 97);
        gameover.image = game.assets[GAME_OVER_PATH];
        gameover.x = (game.width - gameover.width) / 2;
        gameover.y = 100;
        game.rootScene.addChild(gameover);
        game.stop();
      }
    });

    game.rootScene.addEventListener('touchstart', function(e) {
      var missile = new Sprite(16,16);
      missile.image = game.assets[MISSILE_PATH];
      missile.frame = 54;
      missile.x = bear.x + 20;
      missile.y = bear.y + 10;

      missile.addEventListener('enterframe',function(){
        this.x += 8;
//        for(var i = 0; i < enemies.length; i++){
//          if(enemies[i].intersect(this)){
//            game.rootScene.removeChild(enemies[i]);
//            game.rootScene.removeChild(this);
//            enemies.splice(i, 1);
//            score++;
//            label.text = "SCORE:" + score;
//            break;
//          }
//        }
      });
      game.rootScene.addChild(missile);
    });

    game.rootScene.addChild(bear);
    game.rootScene.backgroundColor = '#000000';
  };

  game.start();

};