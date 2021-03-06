requirejs.config({
  waitSeconds: 200,
  baseUrl: 'lib',
  paths: {
    'app': '../app',
  }
})

requirejs([
  'app/game',
  'userInput',
], function (game, userInput) {

  let running = true
  let muted = false
  let restartButtonReleased = true;

  const gameMusic = new Audio('assets/sounds/Asteroids001.ogg')
  gameMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);

  const victoryMusic = new Audio('assets/sounds/Asteriodsvictory.ogg')
  victoryMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);

  const gasljudet = new Audio('assets/sounds/gasljudet.ogg')
  gasljudet.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  
  const sfxs = {
    gameMusic: gameMusic,
    victoryMusic: victoryMusic,
    gasljudet: gasljudet,
    shot: new Audio('assets/sounds/Asteroidsshot001.ogg'),
    die: new Audio('assets/sounds/Asteroidsdie001.ogg'),
    hit: new Audio('assets/sounds/Asteroidhit001.ogg'),
  }
  
  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 80) { // P - pause
      running = !running
    } else if (e.keyCode === 77) { // M - mute
      muted = !muted
      if (muted) {
        gameMusic.pause()
      } else {
        gameMusic.play()
      }
    } else if (e.keyCode === 82) { // R - restart
      game.destroy();
      game.init(playSound);
    }
  })

  function playSound(soundString, shouldPause) {
    if (!muted) {
      if (shouldPause) {
        sfxs[soundString].pause()
      } else {
        sfxs[soundString].play()
      }
    }
  }

  const canvas = document.getElementById('canvas')
  const renderingContext = canvas.getContext('2d')

  game.init(playSound)

  var FPS = 1000/144;

  setInterval(function() {
    if (!running) return;
    const pad = userInput.getInput(0);
    if (!pad.buttons[9].pressed) {
      restartButtonReleased = true;
    }
    if (pad.buttons[9].pressed && restartButtonReleased) {
      restartButtonReleased = false;
      game.destroy();
      game.init(playSound);
    }
    game.tick(FPS);
    game.draw(renderingContext);
  }, FPS);
})
