class Generator {
  constructor(notesScale={c:0}, genFunc=_=>{return {note: 0, vel:0, oct:0}}) {
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
    const noteObject = Generator.genFunc();
    noteObject.note = Object.values(Generator.gScale)[noteObject.note]+(noteObject.oct)*12;

    if (noteObject.note == undefined || noteObject.note == null || noteObject.oct == 0) {
      noteObject.vel = 0;
    }
    return noteObject;
  }
}
