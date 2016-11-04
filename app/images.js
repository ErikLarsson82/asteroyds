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

  var gameover = new Image();
  gameover.src = "./assets/images/gameover.png";

  var particle = new Image();
  particle.src = "./assets/images/motorparticle.png";

  var star = new Image();
  star.src = "./assets/images/star.png";

  var asteroidsParticle = new Image();
  asteroidsParticle.src = "./assets/images/asteroidsparticle.png";

  var deathparticle = new Image();
  deathparticle.src = "./assets/images/deathparticle.png";

  var starry = new Image();
  starry.src = "./assets/images/starryeyes.png";

  return {
    ship: ship,
    playerbullet: playerbullet,
    asteroydBig: asteroydBig,
    asteroydMedium: asteroydMedium,
    asteroydSmall: asteroydSmall,
    victory: victory,
    particle: particle,
    asteroidsParticle: asteroidsParticle,
    gameover: gameover,
    deathparticle: deathparticle,
    starry: starry,
    star: star
  }
})