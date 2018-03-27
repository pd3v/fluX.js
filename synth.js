class Synth {
  constructor(adsr={a:0,d:0,s:0,r:0}) {
    this.adsrEnv = adsr;
  }

  get audioContext() {
    return this.ac;
  }

  set audioContext(value) {
    this.ac = value;
    this.engine();
  }

  engine(){
    this.osc = this.ac.createOscillator();
    this.oscGain = this.ac.createGain();
    this.osc.onended = _ => {
      this.disconnect();
    }
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
    this.sVel = this.MIDIVelToAmp(value);
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

    this.oscGain.gain.setValueAtTime(0,0);
    this.oscGain.gain.linearRampToValueAtTime(this.sVel, time+this.adsrEnv.a);
    this.oscGain.gain.linearRampToValueAtTime(this.sVel, time+(this.adsrEnv.s-this.adsrEnv.a-this.adsrEnv.d));

    this.stop(time);
  }

  stop(time=0) {
    try {
      this.oscGain.gain.linearRampToValueAtTime(0.0, time+(this.adsrEnv.s-this.adsrEnv.a-this.adsrEnv.d)+this.adsrEnv.r);

      this.osc.stop(time+(this.adsrEnv.s-this.adsrEnv.a-this.adsrEnv.d)+this.adsrEnv.r);
    } catch(err) {
        console.log(err);
    }
  }
}

// Synth class extended to become a FM synth
class SynthFM extends Synth {
  engine() {
    this.carrier = ac.createOscillator();
    this.carrierGain = ac.createGain();
    this.modulator = ac.createOscillator();
    this.modulator.frequency.setValueAtTime(500, 0);
    this.modulatorGain = ac.createGain();
    this.modulatorGain.gain.setValueAtTime(10, 0)

    this.carrier.onended = _ => {
      this.disconnect();
    }
    this.modulator.connect(this.modulatorGain);
  }

  get note() {
    return this.carrier.frequency.value;
  }

  set note(note) {
    this.carrier.frequency.setValueAtTime(this.MIDINoteToFreq(note), 0);
  }

  get vel() {
    return this.carrierGain.gain.value;
  }

  set vel(value) {
    this.sVel = this.MIDIVelToAmp(value);
  }

  connect(destination) {
    this.modulatorGain.connect(this.carrier.frequency);
    this.carrier.connect(destination);
  }

  disconnect(time=0) {
    this.modulator.disconnect(time);
    this.modulatorGain.disconnect(time);
    this.carrier.disconnect(time);
    this.carrierGain.disconnect(time);
  }

  start(time=0) {
    this.modulator.start(time);
    this.carrier.start(time);

    this.carrierGain.gain.setValueAtTime(0,0);
    this.carrierGain.gain.linearRampToValueAtTime(this.sVel, time+this.adsrEnv.a);
    this.carrierGain.gain.linearRampToValueAtTime(this.sVel, time+(this.adsrEnv.s-this.adsrEnv.a-this.adsrEnv.d));

    this.stop(time);
  }

  stop(time=0) {
    try {
      this.carrierGain.gain.linearRampToValueAtTime(0.0, time+(this.adsrEnv.s-this.adsrEnv.a-this.adsrEnv.d)+this.adsrEnv.r);
      this.carrier.stop(time+(this.adsrEnv.s-this.adsrEnv.a-this.adsrEnv.d)+this.adsrEnv.r);
      this.modulator.stop(time+(this.adsrEnv.s-this.adsrEnv.a-this.adsrEnv.d)+this.adsrEnv.r);
    } catch(err) {
        console.log(err);
    }
  }
}
