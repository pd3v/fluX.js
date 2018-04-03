class Generator {
  constructor(notesScale={c:0}, genFunc=_=>{return {note: 0, vel:0, oct:0}}) {
    Generator.genWorkerBlobURL = URL.createObjectURL(new Blob(['(',
    function() {
        onmessage = function(e) {
          postMessage({result:e.data.f});
        }
    }.toString(),
    ')()'], {type: 'application/javascript'}));

    Generator.genFunc = genFunc;
    Generator.notesQueue = [];
    Generator.gScale = notesScale;
    Generator.counter_ = 1;
    Generator.counter = 0;

    Array.prototype.shiftAndGen = function(){
      if (this.length < 15) {
        Generator.genNote();
      }
      return this.shift();
    }
  }

  static genNote() {
    let genWorker = new Worker(Generator.genWorkerBlobURL);

    // filling array with generated notes
    if (Generator.notesQueue.length < 150) {
		  genWorker.postMessage({f:Generator.genFunc()});
  		genWorker.onmessage = function(e) {
        let noteObject = e.data.result;
        noteObject.note = Object.values(Generator.gScale)[noteObject.note]+(noteObject.oct)*12;

        if (noteObject.note == undefined || noteObject.note == null || noteObject.oct == 0) {
          noteObject.vel = 0;
        }
  			Generator.notesQueue.push(noteObject);

        Generator.genNote();
		  }
      Generator.counter++;
    } else {
      // array is filled up with notes objects
      genWorker.terminate();
      genWorker = null;
    }

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
    // note is now on its set octave
    let noteObject = Generator.notesQueue.shiftAndGen();
    //Generator.counter_ += 1;

    if (noteObject != undefined) {
      console.log(noteObject.note, noteObject.oct);
      return noteObject;
    } else {
      return {note:0,vel:0,dur:4,oct:5}; // silence
    }
  }
}
