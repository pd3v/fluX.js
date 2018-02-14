class Generator {
  constructor(notesScale={'c':'60'}, genFunc=_=>{return {note: 0, octave:3}}) {    
    Generator.gScale = notesScale;
    Generator.genFunc = genFunc;
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
  
  static note(){  
    let genFunc = Generator.genFunc()
    let midiNote = Object.values(Generator.gScale)[genFunc.note]+(genFunc.octave)*12;
    let note = Generator.MIDINoteToFreq(midiNote);
    
    if (note == null || note <= 40) { note = 0; }
        
    return note;
  }
}
