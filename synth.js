class Synth {
  constructor(ac, adsr=[0.05, 0, 0.05, 0.05]) {
    this.adsrEnv = adsr;
    this.engine();
  }

  engine(){
    this.osc = ac.createOscillator();
    this.oscGain = ac.createGain();
  }

  MIDINoteToFreq(midiNote) {
    return (2**((midiNote-69.0)/12))*440.0;
  }

  MIDIVelToAmp(midiValue) {
    return midiValue/127.0;
  }

  set onended(f) {
    this.osc.onended = f;
  }

  get waveType() {
    return this.osc.type;
  }

  set waveType(type) {
    this.osc.type = type;
  }

  get note() {
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

  get vel() {
    return this.oscGain.gain.value;
  }

  set vel(value) {
    this.oscGain.gain.setValueAtTime(this.MIDIVelToAmp(value), 0);
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
