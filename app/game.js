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

  const safeZone = {
    x: canvasWidth/2-300,
    y: canvasHeight/2-300,
    width: 600,
    height: 600
  }

  const DEBUG_WRITE_BUTTONS = false
  const DEBUG_DISABLE_GRAPHICS = false;
  const DEBUG_DRAW_CIRCLES = false;
  const DEBUG_DRAW_SAFE_ZONE = false;

  let gameOver = false;
  let fadeInText = 0;

  let playSound

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
      this.rotation = config.rotation || 0;
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
      this.direction = this.direction + this.rotation;
      handleMove(this);
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
    destroy() {
      this.markedForRemoval = true;
      if (this instanceof AsteroydBig ||
          this instanceof AsteroydMedium ||
          this instanceof AsteroydSmall) {
        playSound('hit')
      } else if (this instanceof PlayerShip) {
        playSound('die')
      }
    }
  }

  class Particle extends GameObject {
    constructor(config) {
      super(config);
      this.lifetimeMax = config.lifetime;
      this.lifetime = config.lifetime;
    }
    tick() {
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      this.pos = nextPosition;

      this.lifetime--;
      if (this.lifetime <= 0) this.markedForRemoval = true;
    }
    draw(renderingContext) {
      renderingContext.globalAlpha = (this.lifetime / this.lifetimeMax);
      super.draw(renderingContext);
      renderingContext.globalAlpha = 1;
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
        this.createParticles();
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
    createParticles() {
      if (Math.random() > 0.7) {
        var particleSettings = {
          pos: {
            x: this.pos.x + -Math.sin(this.direction) * 26,
            y: this.pos.y + Math.cos(this.direction) * 26,
          },
          velocity: {
            x: -Math.sin(this.direction) * 4 + (Math.random() - 0.5) * 2,
            y: Math.cos(this.direction) * 4 + (Math.random() - 0.5) * 2
          },
          direction: Math.floor(Math.random() * 360),
          rotation: Math.random() * 0.05,
          radius: 2,
          image: images.particle,
          lifetime: 40
        }
        var particle = new Particle(particleSettings);
        gameObjects.push(particle);
      }
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
        radius: 6,
        direction: this.direction,
        image: images.playerbullet
      }
      var shot = new Shot(shotConfig);
      gameObjects.push(shot);
      playSound('shot')
    }
  }

  class Shot extends GameObject {
    constructor(config) {
      super(config);
      this.duration = 180;
    }
    tick() {
      this.duration--;
      if (this.duration < 0) this.markedForRemoval = true;

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

  class AsteroydMedium extends GameObject {
    tick() {
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      this.pos = nextPosition;

      super.tick();
    }
  }

  class AsteroydSmall extends GameObject {
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

  function getOfType(gameObject, other, type) {
    if (gameObject instanceof type && other instanceof type) {
      console.warn(`Both ${gameObject} and ${other} were of type ${type}`)
    }
    if (gameObject instanceof type) {
      return gameObject
    } else if (other instanceof type) {
      return other
    }
    console.error(`None of type ${type}, ${gameObject} - ${other}`)
  }

  function particleExplosion(pos, amount) {
    _.each(new Array(amount), function() {
      var particleSettings = {
        pos: {
          x: pos.x,
          y: pos.y,
        },
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4
        },
        direction: 0,
        rotation: 0,
        radius: 0,
        image: images.particle,
        lifetime: 30
      }
      var particle = new Particle(particleSettings);
      gameObjects.push(particle);    
    });
  }

  function resolveCollision(gameObject, other) {
    if (isOfTypes(gameObject, other, PlayerShip, AsteroydBig)) {
      gameObject.destroy();
      other.destroy();
    }
    if (isOfTypes(gameObject, other, PlayerShip, AsteroydMedium)) {
      gameObject.destroy();
      other.destroy();
    }
    if (isOfTypes(gameObject, other, PlayerShip, AsteroydSmall)) {
      gameObject.destroy();
      other.destroy();
    }

    if (isOfTypes(gameObject, other, Shot, AsteroydBig)) {
      var shot = getOfType(gameObject, other, Shot)
      var asteroydBig = getOfType(gameObject, other, AsteroydBig)

      _.each(new Array(3), function() {
        var asteroydSettings = {
          pos: {
            x: asteroydBig.pos.x,
            y: asteroydBig.pos.y,
          },
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
          },
          direction: Math.floor(Math.random() * 360),
          rotation: Math.random() * 0.05,
          radius: 36,
          image: images.asteroydMedium
        }
        var asteroydMedium = new AsteroydMedium(asteroydSettings);
        gameObjects.push(asteroydMedium);
      });

      shot.destroy();
      asteroydBig.destroy();
      particleExplosion(asteroydBig.pos, 10);
    }

    if (isOfTypes(gameObject, other, Shot, AsteroydMedium)) {
      var shot = getOfType(gameObject, other, Shot)
      var asteroydMedium = getOfType(gameObject, other, AsteroydMedium)

      _.each(new Array(2), function() {
        var asteroydSettings = {
          pos: {
            x: asteroydMedium.pos.x,
            y: asteroydMedium.pos.y,
          },
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
          },
          direction: Math.floor(Math.random() * 360),
          rotation: Math.random() * 0.05,
          radius: 16,
          image: images.asteroydSmall
        }
        var asteroydSmall = new AsteroydSmall(asteroydSettings);
        gameObjects.push(asteroydSmall);
      });

      shot.destroy();
      asteroydMedium.destroy();
      playSound('hit')
      particleExplosion(asteroydMedium.pos, 10);
    }

    if (isOfTypes(gameObject, other, Shot, AsteroydSmall)) {
      gameObject.destroy();
      other.destroy();

      var asteroydSmall = getOfType(gameObject, other, AsteroydSmall)
      particleExplosion(asteroydSmall.pos, 10);
    }
  }

  function handleMove(gameObject) {
    _.each(gameObjects, function(item) {
      if (gameObject !== item) {
        if (utils.distance(gameObject, item) < 0 &&
          !gameObject.markedForRemoval &&
          !item.markedForRemoval) {
          resolveCollision(gameObject, item)
        }
      }
    })
  }

  function playerAlive() {
    var playerDead = _.filter(gameObjects, function(item) {
        return item instanceof PlayerShip;
      }).length;
    return (playerDead !== 0);
  }

  function endConditions() {
    var amountStroyds = _.filter(gameObjects, function(item) {
        return item instanceof AsteroydBig ||
               item instanceof AsteroydMedium ||
               item instanceof AsteroydSmall;
      }).length;
    if (amountStroyds === 0) gameOver = true;

    if (!playerAlive()) gameOver = true;
  }

  return {
    init: function(_playSound) {
      playSound = _playSound
      playSound('gameMusic')
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
        var pos = {
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight
        };
        while(pos.x > safeZone.x &&
              pos.x < safeZone.x + safeZone.width &&
              pos.y > safeZone.y &&
              pos.y < safeZone.y + safeZone.height) {
          pos = {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight
          }
        }
        gameObjects.push(new AsteroydBig({
          pos: pos,
          velocity: {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5
          },
          direction: Math.floor(Math.random() * 360),
          rotation: Math.random() * 0.005,
          radius: 65,
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
      renderingContext.fillStyle = "#01020B"
      renderingContext.fillRect(0,0,canvasWidth, canvasHeight)

      if (DEBUG_DRAW_SAFE_ZONE) {
        renderingContext.fillStyle = "red"
        renderingContext.fillRect(safeZone.x, safeZone.y, safeZone.width, safeZone.height)
      }

      _.each(gameObjects, function (gameObject) {
        gameObject.draw(renderingContext)
      })

      
      if (gameOver) {
        if (fadeInText < 1) fadeInText += 0.01;
        renderingContext.globalAlpha = fadeInText;
        if (playerAlive()) {
          renderingContext.drawImage(images.victory,
            Math.round(canvasWidth/2 - images.victory.width/2),
            Math.round(canvasHeight/2 - images.victory.height/2)
          );
        } else {
          renderingContext.drawImage(images.gameover,
            Math.round(canvasWidth/2 - images.gameover.width/2),
            Math.round(canvasHeight/2 - images.gameover.height/2)
          );
        }
        renderingContext.globalAlpha = 1;
      }
    },
  }
})
