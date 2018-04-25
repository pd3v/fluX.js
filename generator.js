class Generator {
  constructor(notesScale={c:0}, genFunc=_=>{return {note: 0, vel:0, oct:0}}) {
    Generator.QUEUE_SIZE = 20;
    Generator.genWorkerBlobURL = URL.createObjectURL(new Blob(['(',
    function() {
        onmessage = function(e) {
          postMessage({note:e.data.f});
        }
    }.toString(),
    ')()'], {type: 'application/javascript'}));

    Generator.genFunc = genFunc;
    Generator.notesQueue = Array(Generator.QUEUE_SIZE);
    Generator.queueIndex = 0;
    Generator.gScale = notesScale;
    Generator.counter = 0;

    Array.prototype.getAndGen = function(){
      if (Generator.queueIndex < Generator.QUEUE_SIZE/3) {
        Generator.genNote();
      }
      let note = this[0];
      this.copyWithin(0,1);

      Generator.queueIndex > 0 ? Generator.queueIndex-- : Generator.queueIndex = 0;

      return note != undefined ? note : {note:0,vel:0,dur:1,oct:3};
    }
  }

  static genNote() {
    let genWorker = new Worker(Generator.genWorkerBlobURL);

    // filling array with generated notes
    if (Generator.queueIndex < Generator.QUEUE_SIZE) {
		  genWorker.postMessage({f:Generator.genFunc()});

  		genWorker.onmessage = function(e) {
        if (e.data.note.note == undefined || e.data.note.note == null || e.data.note.oct == 0) {
          e.data.note.vel = 0;
        }
        e.data.note.note = Object.values(Generator.gScale)[e.data.note.note]+(e.data.note.oct)*12;
        Generator.notesQueue[Generator.queueIndex] = e.data.note;
        Generator.queueIndex++;

        Generator.genNote();
		  }
      Generator.counter++;
    } else {
      // array is filled up with note objects
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
    return Generator.notesQueue.getAndGen();
  }
}
