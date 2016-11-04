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
  const DEBUG_DRAW_CIRCLES = !true;

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
      this.velocity = config.velocity;
      this.direction = config.direction;
      this.radius = config.radius;
      this.image = config.image;
    }
    tick() {
      //Wrap logic
      if (this.pos.x > canvasWidth + this.radius) {
        this.pos.x = -this.radius;
      }
      if (this.pos.x < 0 - this.radius) {
        this.pos.x = canvasWidth + this.radius;
      }
      if (this.pos.y > canvasHeight + this.radius) {
        this.pos.y = -this.radius;
      }
      if (this.pos.y < 0 - this.radius) {
        this.pos.y = canvasHeight + this.radius;
      }
    }
    draw(renderingContext) {
      this.drawImage(renderingContext);

      if (DEBUG_DRAW_CIRCLES) {
        renderingContext.beginPath();
        renderingContext.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        renderingContext.lineWidth = 2;
        renderingContext.strokeStyle = "white";
        renderingContext.stroke();
      }
    }
    drawImage(renderingContext) {
      renderingContext.save();
      renderingContext.translate(this.pos.x, this.pos.y);
      renderingContext.rotate(this.direction);
      renderingContext.drawImage(this.image, 0 - this.image.width/2, 0 - this.image.height/2);
      renderingContext.restore();
    }
    remove() {
      this.markedForRemoval = true;
    }
  }

  class PlayerShip extends GameObject {
    constructor(config) {
      super(config)
      this.recharged = true
      this.rechargeTimer = 0;
    }
    handleRecharge() {
      this.rechargeTimer--;
      if (this.rechargeTimer <= 0) {
        this.recharged = true;
      }
    }
    tick() {
      this.handleRecharge();

      const pad = userInput.getInput(0)
      if (pad.buttons[14].pressed) { // left
        this.direction -= 0.03;
      }
      if (pad.buttons[15].pressed) { // right
        this.direction += 0.03;
      }
      if (pad.buttons[0].pressed) { // z or space
        this.fire();
      }
      var acceleration = {
        x: 0,
        y: 0
      }
      if (pad.buttons[12].pressed) {
        acceleration = {
          x: Math.sin(this.direction) / 100,
          y: -Math.cos(this.direction) / 100
        }
      }
      this.velocity = {
        x: this.velocity.x + acceleration.x,
        y: this.velocity.y + acceleration.y
      }
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      this.pos = nextPosition;

      super.tick();
    }
    fire() {
      if (!this.recharged) return;

      this.recharged = false;
      this.rechargeTimer = 40;
      
      var shotConfig = {
        pos: {
          x: this.pos.x + Math.sin(this.direction) * 26,
          y: this.pos.y + -Math.cos(this.direction) * 26
        },
        velocity: {
          x: Math.sin(this.direction) * 3,
          y: -Math.cos(this.direction) * 3
        },
        direction: this.direction,
        image: images.playerbullet
      }
      var shot = new Shot(shotConfig);
      gameObjects.push(shot);
    }
  }

  class Shot extends GameObject {
    tick() {
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      this.pos = nextPosition;

      super.tick();
    }
  }

  class AsteroydBig extends GameObject {
    tick() {
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      this.pos = nextPosition;

      super.tick();
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
        velocity: {
          x: 0,
          y: 0
        },
        direction: 0,
        radius: 16,
        image: images.ship
      })
      gameObjects.push(playerShip)

      _.each(new Array(6), function() {

        gameObjects.push(new AsteroydBig({
          pos: {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight
          },
          velocity: {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5
          },
          direction: Math.floor(Math.random() * 360),
          radius: (Math.random() * 25) + 25,
          image: images.asteroydBig
        }))

      })
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
