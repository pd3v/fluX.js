class Sequencer {
  constructor(ac){
  }
    
  get synth() {
    return Sequencer.sType;
  }
  
  static set synth(value) {
    Sequencer.sType = value + '(ac)';
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
  
  static start(bpm=90, pattern=[8]) {
    let waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];
    let chromScale = [0, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25];
    let beat = {32: 125, 16: 250, 8: 500, 3: 333, 4: 1000, 2: 2000, 1: 4000}
    let octave = ((Math.random()*2)+1).toFixed(0); 
    
    Sequencer.sbpm = bpm;
    Sequencer.spattern = pattern;
    
    let note = chromScale[(Math.random()*(chromScale.length)).toFixed(0)];
    if (note == null || note < 40) {note = 0;}
    
    let asynth = eval('new '+Sequencer.sType);
    asynth.type = waveTypes[(Math.random()*3).toFixed(0)];
    
    asynth.frequency = note*octave;
    asynth.adsr = [0.0, 0.0, (beat[Sequencer.spattern[cont%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60), 0.01];
  
    asynth.connect(analyser);    
    asynth.connect(ac.destination);

    asynth.start(ac.currentTime+asynth.adsr[0]);
    asynth.stop(ac.currentTime+(beat[Sequencer.spattern[cont%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60)+asynth.adsr[3]);
    
    asynth.osc.onended = function() {
      setTimeout(Sequencer.start, 0, Sequencer.sbpm, Sequencer.spattern);
    };
    
    cont++;
  }
}
