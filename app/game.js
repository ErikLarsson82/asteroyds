define('app/game', [
  'underscore',
  'userInput',
  'utils',
  'SpriteSheet',
  'app/images'
], function (
  _,
  userInput,
  utils,
  SpriteSheet,
  images
) {
  const canvasWidth = 1024
  const canvasHeight = 768

  const DEBUG_WRITE_BUTTONS = false
  const DEBUG_DISABLE_GRAPHICS = false;
  const DEBUG_DRAW_CIRCLES = true;

  let gameOver = false;

  //let playSound

  let gameObjects = []
  let playerShip

  class GameObject {
    constructor(config) {
      this.markedForRemoval = false;
      this.pos = config.pos || {
        x: 0,
        y: 0,
      }
      this.radius = config.radius;
    }
    tick() {
      //move myself
    }
    draw(renderingContext) {

    }
    remove() {
      this.markedForRemoval = true;
    }
  }

  class PlayerShip extends GameObject {
    constructor(config) {
      super(config)
      this.velocity = {
        x: 0.1,
        y: 0
      }
      this.direction = config.direction;
      this.recharged = true
      this.rechargeTimer = 0;
    }
    tick() {

      const pad = userInput.getInput(0)
      if (pad.buttons[14].pressed) { // left
        this.direction += 360 / 100;
      }
      console.log(this.direction);
      this.rechargeTimer--;
      if (this.rechargeTimer <= 0) {
        this.recharged = true;
      }
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y,
      }
      this.pos = nextPosition;
    }
    fire() {
      this.recharged = false;
      this.rechargeTimer = 30;
    }
    draw(renderingContext) {
      if (DEBUG_DRAW_CIRCLES) {
        renderingContext.beginPath();
        renderingContext.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        renderingContext.lineWidth = 2;
        renderingContext.strokeStyle = "white";
        renderingContext.stroke();
      }
    }
  }

  function isOfTypes(gameObject, other, type1, type2) {
    return (gameObject instanceof type1 && other instanceof type2) ||
        (gameObject instanceof type2 && other instanceof type1)
  }

  function endConditions() {
    /*_.chain(gameObjects)
        .filter(function(item) {
          return item instanceof Enemy;
        })
        .each(function(item) {
          if (item.hitbox.y > 620) gameOver = true;
        });

    var enemies = _.filter(gameObjects, function(item) {
      return item instanceof Enemy || item instanceof EnemyExplosion;
    });
    if (enemies.length === 0) gameOver = true;*/
  }

  return {
    init: function() {
      playerShip = new PlayerShip({
        pos: {
          x: canvasWidth / 2,
          y: canvasHeight / 2
        },
        direction: 0,
        radius: 10
      })
      gameObjects.push(playerShip)

    },
    tick: function() {

      endConditions();

      if (gameOver) {
        return;
      }

      _.each(gameObjects, function (gameObject) {
        gameObject.tick();
      })

      gameObjects = gameObjects.filter(function (gameObject) {
        return !gameObject.markedForRemoval
      })
    },
    draw: function (renderingContext) {
      renderingContext.fillStyle = "black"
      renderingContext.fillRect(0,0,canvasWidth, canvasHeight)

      _.each(gameObjects, function (gameObject) {
        gameObject.draw(renderingContext)
      })

      if (gameOver) {
        renderingContext.font= "30px Verdana";
        renderingContext.fillStyle="white";
        renderingContext.fillText("GAME OVER",145,100);
      }
    },
  }
})
