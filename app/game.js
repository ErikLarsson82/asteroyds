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
      this.speed = config.speed;
      this.velocity = {
        x: 0,
        y: 0
      }
      this.recharged = true
      this.rechargeTimer = 0;
    }
    tick() {
      this.rechargeTimer--;
      if (this.rechargeTimer <= 0) {
        this.recharged = true;
      }
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

  /*class PlayerBullet extends GameObject {
    constructor(config) {
      super(config)
      this.speed = config.speed
    }
    tick() {
      this.velocity.y = -this.speed
    }
    draw(renderingContext) {
      if (!DEBUG_DISABLE_GRAPHICS) {
        renderingContext.drawImage(images.player_shot, this.hitbox.x, this.hitbox.y);
      } else {
        super.draw(renderingContext);
      }
    }
  }*/

  function isOfTypes(gameObject, other, type1, type2) {
    return (gameObject instanceof type1 && other instanceof type2) ||
        (gameObject instanceof type2 && other instanceof type1)
  }

  function resolveCollision(gameObject, other) {
    /*if (isOfTypes(gameObject, other, Enemy, PlayerBullet)) {
      gameObject.remove();
      other.remove();

      playSound('enemyHit')
      gameObjects.push(new EnemyExplosion({
        hitbox: {
          x: other.hitbox.x,
          y: other.hitbox.y
        },
      }))
    }*/
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
        speed: 0,
        radius: 10
      })
      gameObjects.push(playerShip)

      /*_.each(new Array(7), function(item1, x) {
        _.each(new Array(3), function(item2, y) {
          gameObjects.push(new Enemy({
            hitbox: {
              x: 50 + (x * 45),
              y: 20 + (y * 45),
              width: 27,
              height: 21,
            }
          }))
        });
      })*/
    },
    tick: function() {

      endConditions();

      if (gameOver) {
        return;
      }

      /*if (pad.buttons[14].pressed) { // left
        //playerShip.velocity.x = -playerShip.speed
      }
      if (pad.buttons[15].pressed) { // right
        //playerShip.velocity.x = playerShip.speed
      }
      if (pad.buttons[0].pressed && playerShip.recharged) { // shoot
        playSound('shot')
        playerShip.fire();
        gameObjects.push(new PlayerBullet({
          hitbox: {
            x: playerShip.hitbox.x + playerShip.hitbox.width / 2,
            y: playerShip.hitbox.y - bulletHeight,
            width: 3,
            height: bulletHeight,
          },
          speed: 7,
        }))
      }*/

      _.each(gameObjects, function (gameObject) {
        gameObject.tick()
      })

      // resolve movement changes and collisions
      _.each(gameObjects, function (gameObject) {
        /*const nextPosition = {
          x: gameObject.hitbox.x + gameObject.velocity.x,
          y: gameObject.hitbox.y + gameObject.velocity.y,
        }
        for (let i = 0; i < gameObjects.length; i++) {
          const other = gameObjects[i]
          if (!other.markedForRemoval && !gameObject.markedForRemoval &&
            detectCollision(
              gameObject.hitbox,
              nextPosition,
              other.hitbox)) {
            resolveCollision(gameObject, other)
          }*/
        //}

        // set new position
        // if (
        //     nextPosition.x >= 0 &&
        //     nextPosition.x + gameObject.hitbox.width <= canvasWidth)
        // {
          //gameObject.hitbox.x = nextPosition.x
          //gameObject.hitbox.y = nextPosition.y
        // }

        // reset velocity
        //gameObject.velocity.x = 0
        //gameObject.velocity.y = 0

      })

      // remove all removed gameObjects
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
