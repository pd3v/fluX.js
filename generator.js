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
  
  get note() {
    return Generator.note();
  }
  
  static note(){  
    var noteObject = Generator.genFunc();
    noteObject.note = Object.values(Generator.gScale)[noteObject.note]+(noteObject.octave)*12;
    
    if (noteObject.note == null || noteObject.note < 24) { noteObject.note = 0; }
    
    return noteObject;
  }
}
