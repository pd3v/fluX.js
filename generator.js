class Generator {
  constructor(notesScale={'c':'60'}, genFunc) {    
    Generator.gCounter = 0;
    Generator.gScale = notesScale;
    Generator.gGenFunc = genFunc;
  }
  
  get scale() {
    return Generator.gScale;
  }
  
  static set scale(value) {
    Generator.gScale = value;
  }
  
  static MIDINoteToFreq(midiNote) {
    return (2**((midiNote-69.0)/12))*440.0; 
  }
  
  get note() {
    return Generator.note();
  }
  
  static set note(value) {
    Generator.gGenFunc = genFunc;
    this.gNote = value;
  }
  
  static note(){
    let octave = ((Math.random()*6)+1).toFixed(0)*12; 
    let midiNote = parseInt(Object.values(Generator.gScale)[(Math.random()*(Object.keys(Generator.gScale).length-1)).toFixed(0)]) + octave; 
    let note = Generator.MIDINoteToFreq(midiNote);
    
    if (note == null || note <= 40) {note = 0;}
    
    Generator.gCounter++;
    
    return note;
  }
}
