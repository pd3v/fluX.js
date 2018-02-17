class Synth {
  constructor(ac, adsr=[0.05, 0, 0.05, 0.05]) {    
    this.osc = ac.createOscillator();
    this.oscGain = ac.createGain();
    this.adsrEnv = adsr;
  }
  
  MIDINoteToFreq(midiNote) {
    return (2**((midiNote-69.0)/12))*440.0; 
  }
  
  MIDIValueToAmp(midiValue) {
    return midiValue/127.0;
  }
  
  get waveType() {
    return this.osc.type;
  }
  
  set waveType(type) {
    this.osc.type = type;
  }
  
  get note() {
    console.log(this.osc.frequency.value);
    return this.osc.frequency.value;
  }
  
  set note(note) {    
    this.osc.frequency.setValueAtTime(this.MIDINoteToFreq(note), 0);
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
    this.oscGain.gain.setValueAtTime(this.MIDIValueToAmp(value), 0);
  }

  connect(destination) {
    this.osc.connect(this.oscGain);
    this.oscGain.connect(destination);
  }
  
  disconnect(time=0) {
    this.osc.disconnect(time);
    this.oscGain.disconnect(time);
  }
  
  start(time=0) {
    this.osc.start(time);
  }
  
  stop(time=0) {
    this.osc.stop(time);
  }
}
