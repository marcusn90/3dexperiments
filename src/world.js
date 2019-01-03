const World = {
  get WIDTH() {
    return window.innerWidth;
  },
  get HEIGHT() {
    return window.innerHeight;
  },
  get RATIO() {
    return this.WIDTH / this.HEIGHT;
  },

  prev_t: 0,
  t: 0,

  get dT() {
    return this.t - this.prev_t;
  },

  start_timer() {
    this.t = Date.now();
    this.prev_t = this.t;
  },

  init() {
    this.start_timer();
  },

  update() {
    this.prev_t = this.t;
    this.t = Date.now();
  }
}
export default World;