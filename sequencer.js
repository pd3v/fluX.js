class Sequencer {
  constructor(ac){
  }
    
  get synth() {
    return Sequencer.synth;
  }
  
  static set synth(value) {
    Sequencer.synth = value + '(ac)';
  }
  
  get generator() {
    return Sequencer.gen;
  }
  
  static set generator(scale) {
    Sequencer.gen = eval('new Generator('+JSON.stringify(scale)+','+f+')');
  }
  
  get bpm() {
    return Sequencer.bpm;
  }
  
  static set bpm(value) {
    Sequencer.sbpm = value;
  }
  
  get pattern() {
    return Sequencer.pattern;
  }
  
  static set pattern(value) {
    Sequencer.spattern = value;
  }
  
  static synth(value) {
    Sequencer.synth = value + '(ac)';
    return this; 
  }

  static generator(scale, f) {
    Sequencer.counter = 0;
    Sequencer.gen = eval('new Generator('+JSON.stringify(scale)+','+f+')');
    return this; 
  }
  
  static start(bpm=90, pattern=[8]) {
    let waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];
    let beat = {64: 65, 32: 125, 16: 250, 8: 500, 3: 333, 4: 1000, 2: 2000, 1: 4000}
    
    Sequencer.sbpm = bpm;
    Sequencer.spattern = pattern;
    
    let asynth = eval('new '+Sequencer.synth);
    asynth.waveType = waveTypes[(Math.random()*3).toFixed(0)];
    
    asynth.frequency = Sequencer.gen.note;
    asynth.adsr = [0.0, 0.0, (beat[Sequencer.spattern[Sequencer.counter%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60), 0.01];
  
    asynth.connect(analyser);    
    asynth.connect(ac.destination);

    asynth.start(ac.currentTime+asynth.adsr[0]);
    asynth.stop(ac.currentTime+(beat[Sequencer.spattern[Sequencer.counter%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60)+asynth.adsr[3]);
    
    asynth.osc.onended = function() {
      setTimeout(Sequencer.start, 0, Sequencer.sbpm, Sequencer.spattern);
    };
    
    Sequencer.counter++;
    Sequencer.gen.counter = Sequencer.counter;
  }
}
