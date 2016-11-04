requirejs.config({
  waitSeconds: 200,
  baseUrl: 'lib',
  paths: {
    'app': '../app',
  }
})

requirejs([
  'app/game',
], function (game) {

  let running = true
  let muted = false

  const musicAudio = new Audio('assets/sounds/Asteroids001.ogg')
  musicAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  
  const sfxs = {
    gameMusic: musicAudio,
    shot: new Audio('assets/sounds/Asteroidsshot001.ogg'),
    die: new Audio('assets/sounds/Asteroidsdie001.ogg'),
    hit: new Audio('assets/sounds/Asteroidhit001.ogg'),
  }
  
  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 80) { // P - pause
      running = !running
    } else if (e.keyCode === 77) { // M - mute
      muted = !muted
    }

    if (muted) {
      musicAudio.pause()
    } else {
      musicAudio.play()
    }
  })

  function playSound(soundString) {
    if (!muted) {
      sfxs[soundString].play()
    }
  }

  const canvas = document.getElementById('canvas')
  const renderingContext = canvas.getContext('2d')

  game.init(playSound)

  setInterval(function() {
    if (!running) return;
    game.tick(1000/60);
    game.draw(renderingContext);
  }, 1000/60);
})
