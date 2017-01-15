const App = new Vue({
  el: '#app',
  data: {
    count: 0,
    isPlaying: true,
    isRevealing: false,
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    handleSetCount(count) {
      this.count = count;
      window.transformRaffles(window.objects, window.tableTargets);
    },
    handleStart(event) {
      this.isRevealing = true;
      window.transformRaffles(window.objects, window.sphereTargets);
      this.raffle();
    },
    handleMusic(event) {
      window.sound.isPlaying ? window.sound.pause() : window.sound.play();
      this.isPlaying = window.sound.isPlaying;
    },
    init() {
      window.initParticles();
      window.initRaffles();
    },
    animate() {
      requestAnimationFrame(this.animate);
      window.animateParticles();
      window.animateRaffles();
    },
    raffle() {
      let timmer = null;
      let candidates = null;

      const startFlashing = () => {
        candidates = _.take(_.shuffle(window.objects), this.count);
        window.objects.forEach(obj => {
          const el = obj.element;
          if (candidates.includes(obj)) {
            el.classList.add('highlight');
            el.classList.add(`rank-${this.count}`);
          } else {
            el.classList.remove('highlight');
            el.classList.remove(`rank-${this.count}`);
          }
        });
      };
      const killFlashing = () => {
        clearInterval(timmer);
        this.revealOneByOne(candidates);
      };

      timmer = setInterval(startFlashing, 150);
      setTimeout(killFlashing, 5000);
    },
    revealOneByOne(candidates, i = 0) {
      if (i >= candidates.length) {
        this.isRevealing = false;
        return;
      }
      const candidate = candidates.slice(i, i + 1);
      window.objects = _.difference(window.objects, candidate);
      window.highlights = _.union(window.highlights, candidate);
      window.transformRaffles(window.highlights, window.gridTargets);
      setTimeout(this.revealOneByOne, 5000, candidates, i + 1);
    },
  },
});
