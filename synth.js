class Synth {
  constructor(ac, adsr=[0.05, 0, 0.05, 0.05]) {    
    this.osc = ac.createOscillator();
    this.oscGain = ac.createGain();
    this.adsrEnv = adsr;
  }
  
  get type() {
    return this.osc.type;
  }
  
  set type(type) {
    this.osc.type = type;
  }
  
  get frequency() {
    return this.osc.frequency.value;
  }
  
  set frequency(frequency) {
    this.osc.frequency.setValueAtTime(frequency, 0);
  }
  
  get adsr() {
    return this.adsrEnv;
  }
  
  set adsr(value) {
    this.adsrEnv = value;
  }
  
  get gain() {
    return this.oscGain.gain.value;
  }
  
  set gain(value) {
    this.oscGain.gain.setValueAtTime(value, 0);
  }

  connect(destination) {
    this.osc.connect(this.oscGain);
    this.oscGain.connect(destination);
  }
  
  start(time=0) {
    this.osc.start(time);
  }
  
  stop(time=0) {
    this.osc.stop(time);
  }
}
