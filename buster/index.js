enchant();

window.onload = function() {

  var Rectangle = enchant.Class.create({
    initialize: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    right: {
      get: function() {
        return this.x + this.width;
      }
    },
    bottom: {
      get: function() {
        return this.y + this.height;
      }
    }
  });

  var MAP_PATH = 'img/map2.gif';
  var CHARA_PATH = 'img/chara1.gif';
  var MISSILE_PATH = 'img/icon0.gif';
  var GAME_OVER_PATH = 'img/gameover.png'

  var game = new Game(320, 320);
  game.fps = 24;

  game.preload(MAP_PATH);
  game.preload(CHARA_PATH);
  game.preload(GAME_OVER_PATH);
  game.preload(MISSILE_PATH);
  game.onload = function() {

    var blocks = [
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1, 4, 4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1, 4,-1,-1,-1,-1,-1,-1, 4,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1, 4, 4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,-1,-1,-1,-1],
      [-1,-1,-1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,-1,-1,-1,-1],
      [-1,-1,-1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,-1,-1,-1,-1],
      [-1,-1,-1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,-1,-1,-1,-1],
      [-1,-1,-1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,-1,-1,-1,-1]
    ];

    var map = new Map(16, 16);
    map.image = game.assets[MAP_PATH];
    map.loadData(blocks);

    var player1 = new Player(game, CHARA_PATH, 0, 40, -32);
    var player2 = new Player(game, CHARA_PATH, 5, 130, 17);
    player2.scaleX = -1;

    player1.addEventListener('enterframe', function() {
      // 抵抗
      var friction = 0;
      if (this.vx > 0.3) {
        friction = -0.3;
      } else if (this.vx > 0) {
        friction = -this.vx;
      }
      if (this.vx < -0.3) {
        friction = 0.3;
      } else if (this.vx < 0) {
        friction = -this.vx;
      }

      // y方向
      if (this.jumping) {
        if (!game.input.up || --this.jumpBoost < 0) {
          this.ay = 0;
        }
      } else {
        if (game.input.up) {
          this.jumpBoost = 5;
          this.ay = -5;
        }
      }

      // x方向
      this.ax = 0;
      if (game.input.right) {
        this.ax += 0.5;
      }
      if (game.input.left) {
        this.ax -= 0.5;
      }

      // 向き
      if (this.ax > 0) {
        this.scaleX = 1;
      } else if (this.ax < 0) {
        this.scaleX = -1;
      }

      // 画像
      if (this.ax != 0) {
        if (game.frame % 3 == 0){
          this.pose++;
          this.pose %= 2;
        }
        this.frame = this.baseFrame + this.pose + 1;
      } else {
        this.frame = this.baseFrame;
      }

      this.vx += this.ax + friction; // 抵抗
      this.vy += this.ay + 2 ; // 2 is gravity

      // 速度上限
      this.vx = Math.min(Math.max(this.vx, -10), 10);
      this.vy = Math.min(Math.max(this.vy, -10), 10);

      var dest = new Rectangle(
        this.x + this.vx + 5, this.y + this.vy + 2,
        this.width-10, this.height-2
      );

      this.jumping = true;

      if (dest.x < -stage.x) {
        dest.x = -stage.x;
        this.vx = 0;
      }
      while (true) {
        var boundary, crossing;
        var dx = dest.x - this.x - 5;
        var dy = dest.y - this.y - 2;
        if (dx > 0 && Math.floor(dest.right / 16) != Math.floor((dest.right - dx) / 16)) {
          boundary = Math.floor(dest.right / 16) * 16;
          crossing = (dest.right - boundary) / dx * dy + dest.y;
          if ((map.hitTest(boundary, crossing) && !map.hitTest(boundary-16, crossing)) ||
            (map.hitTest(boundary, crossing + dest.height) && !map.hitTest(boundary-16, crossing + dest.height))) {
            this.vx = 0;
            dest.x = boundary - dest.width - 0.01;
            continue;
          }
        } else if (dx < 0 && Math.floor(dest.x / 16) != Math.floor((dest.x - dx) / 16)) {
          boundary = Math.floor(dest.x / 16) * 16 + 16;
          crossing = (boundary - dest.x) / dx * dy + dest.y;
          if ((map.hitTest(boundary-16, crossing) && !map.hitTest(boundary, crossing)) ||
            (map.hitTest(boundary-16, crossing + dest.height) && !map.hitTest(boundary, crossing + dest.height))) {
            this.vx = 0;
            dest.x = boundary + 0.01;
            continue;
          }
        }
        if (dy > 0 && Math.floor(dest.bottom / 16) != Math.floor((dest.bottom - dy) / 16)) {
          boundary = Math.floor(dest.bottom / 16) * 16;
          crossing = (dest.bottom - boundary) / dy * dx + dest.x;
          if ((map.hitTest(crossing, boundary) && !map.hitTest(crossing, boundary-16)) ||
            (map.hitTest(crossing + dest.width, boundary) && !map.hitTest(crossing + dest.width, boundary-16))) {
            this.jumping = false;
            this.vy = 0;
            dest.y = boundary - dest.height - 0.01;
            continue;
          }
        } else if (dy < 0 && Math.floor(dest.y / 16) != Math.floor((dest.y - dy) / 16)) {
          boundary = Math.floor(dest.y / 16) * 16 + 16;
          crossing = (boundary - dest.y) / dy * dx + dest.x;
          if ((map.hitTest(crossing, boundary-16) && !map.hitTest(crossing, boundary)) ||
            (map.hitTest(crossing + dest.width, boundary-16) && !map.hitTest(crossing + dest.width, boundary))) {
            this.vy = 0;
            dest.y = boundary + 0.01;
            continue;
          }
        }

        break;
      }
      this.x = dest.x-5;
      this.y = dest.y-2;

      if (this.y > 320) {
        var gameover = new Sprite(189, 97);
        gameover.image = game.assets[GAME_OVER_PATH];
        gameover.x = (game.width - gameover.width) / 2;
        gameover.y = 100;
        game.rootScene.addChild(gameover);
        game.stop();
      }

      if (game.input.down && game.frame % 3 == 0) {
        var missile = new Sprite(16,16);
        missile.image = game.assets[MISSILE_PATH];
        missile.scaleX = this.scaleX;
        missile.frame=54;

        if (missile.scaleX == 1) {
          missile.x = player1.x + 30;
        } else {
          missile.x = player1.x - 10;
        }
        missile.y = player1.y + 5;
        missile.addEventListener('enterframe',function(){
          this.x += 5 * this.scaleX;
          if(player2.intersect(this)){
            player2.frame = 8;
            //game.rootScene.removeChild(player2);
            game.rootScene.removeChild(this);
          }
        });
        game.rootScene.addChild(missile);
      }
      if (game.frame % 100 == 0) {
        player2.frame = 5;
      }

    });

    var stage = new Group();
    stage.addChild(map);
    stage.addChild(player1);
    stage.addChild(player2);
    stage.addEventListener('enterframe', function(e) {
      if (this.x > 64 - player1.x) {
        //this.x = 64 - player1.x;
      }
    });

    game.rootScene.addChild(stage);
    game.rootScene.backgroundColor = 'rgb(182, 255, 255)';
  };
  game.start();
};

function Player(game, imagePath, frame, x, y) {
  var player = new Sprite(32, 32);
  player.image = game.assets[imagePath];
  player.frame = frame;
  player.x = x;
  player.y = y;

  player.vx = 0;
  player.vy = 0;
  player.ax = 0;
  player.ay = 0;
  player.pose = 0;
  player.jumping = true;
  player.jumpBoost = 0;
  player.baseFrame = frame;

  return player;
}