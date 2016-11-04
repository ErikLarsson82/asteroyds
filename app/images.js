define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var ship = new Image();
  ship.src = "./assets/images/ship.png";

  return {
    ship: ship
  }
})