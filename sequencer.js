class Sequencer {
  constructor(ac){
  }
    
  get synth() {
    return Sequencer.sType;
  }
  
  static set synth(value) {
    Sequencer.sType = value + '(ac)';
  }
  
  get generator() {
    return Sequencer.sGen;
  }
  
  static set generator(scale) {
    Sequencer.sGen = eval('new Generator('+JSON.stringify(scale)+')');
  }
  
  get bpm() {
    return Sequencer.sbpm;
  }
  
  static set bpm(value) {
    Sequencer.sbpm = value;
  }
  
  get pattern() {
    return Sequencer.spattern;
  }
  
  static set pattern(value) {
    Sequencer.spattern = value;
  }
  
  static synth(value) {
    Sequencer.sType = value + '(ac)';
    return this; 
  }

  static generator(scale) {
    Sequencer.sCounter = 1;
    Sequencer.sGen = eval('new Generator('+JSON.stringify(scale)+')');
    return this; 
  }
  
  static start(bpm=90, pattern=[8]) {
    let waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];
    let beat = {64: 65, 32: 125, 16: 250, 8: 500, 3: 333, 4: 1000, 2: 2000, 1: 4000}
    
    Sequencer.sbpm = bpm;
    Sequencer.spattern = pattern;
    
    let asynth = eval('new '+Sequencer.sType);
    asynth.waveType = waveTypes[(Math.random()*3).toFixed(0)];
    
    asynth.frequency = Sequencer.sGen.note;
    asynth.adsr = [0.0, 0.0, (beat[Sequencer.spattern[Sequencer.sCounter%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60), 0.01];
  
    asynth.connect(analyser);    
    asynth.connect(ac.destination);

    asynth.start(ac.currentTime+asynth.adsr[0]);
    asynth.stop(ac.currentTime+(beat[Sequencer.spattern[Sequencer.sCounter%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60)+asynth.adsr[3]);
    
    asynth.osc.onended = function() {
      setTimeout(Sequencer.start, 0, Sequencer.sbpm, Sequencer.spattern);
    };
    
    Sequencer.sCounter++;
  }
}
