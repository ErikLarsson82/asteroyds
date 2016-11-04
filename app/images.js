define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var ship = new Image();
  ship.src = "./assets/images/ship.png";

  var playerbullet = new Image();
  playerbullet.src = "./assets/images/playerbullet.png";

  var asteroydBig = new Image();
  asteroydBig.src = "./assets/images/asteroidbig1.png";

  return {
    ship: ship,
    playerbullet: playerbullet,
    asteroydBig: asteroydBig
  }
})