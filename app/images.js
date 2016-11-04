define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var ship = new Image();
  ship.src = "./assets/images/ship.png";

  var playerbullet = new Image();
  playerbullet.src = "./assets/images/playerbullet.png";

  var asteroydBig = new Image();
  asteroydBig.src = "./assets/images/asteroidbig1.png";

  var asteroydMedium = new Image();
  asteroydMedium.src = "./assets/images/asteroidmedium1.png";
  
  var asteroydSmall = new Image();
  asteroydSmall.src = "./assets/images/asteroidsmall1.png";

  var victory = new Image();
  victory.src = "./assets/images/VICTORY.png";

  return {
    ship: ship,
    playerbullet: playerbullet,
    asteroydBig: asteroydBig,
    asteroydMedium: asteroydMedium,
    asteroydSmall: asteroydSmall,
    victory: victory
  }
})