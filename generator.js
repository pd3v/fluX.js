class Generator {
  constructor(notesScaleObj={c:0}, genFunc=_=>{return {notes:{0:0}, vel:0, oct:0}}) {
    Generator.QUEUE_SIZE = 20;
    Generator.genWorkerBlobURL = URL.createObjectURL(new Blob(['(',
    function() {
      onmessage = function(e) {
        Function('"use strict"; return('+e.data.h+')')()(this, e.data.c);
        let f = Function('"use strict"; return('+e.data.f+')')()(e.data.s);

        if (e.data.f.notes == undefined || e.data.f.notes == null)
          e.data.f.vel = 0;
      
        Object.keys(f.notes).forEach(function(k) {
          f.notes[k] = e.data.s[f.notes[k]]+(f.oct)*12;
        });

        postMessage({notes:f});
      }
    }.toString(),
    ')()'], {type: 'application/javascript'}));

    Generator.helpers = helpers;
    Generator.genFunc = genFunc;
    Generator.notesQueue = Array(Generator.QUEUE_SIZE);
    Generator.queueIndex = 0;
    Generator.gScale = notesScaleObj;
    Generator.scaleNotes = Object.values(notesScaleObj);
    Generator.counter = 0;

    Array.prototype.getAndGen = function(){
      if (Generator.queueIndex < Generator.QUEUE_SIZE/3) {
        Generator.genNote();
      }
      let notes = this[0];
      this.copyWithin(0,1);

      Generator.queueIndex > 0 ? Generator.queueIndex-- : Generator.queueIndex = 0;
      
      return notes != undefined ? notes : {notes:{0:0},vel:0,dur:1,oct:3};
    }
  }

  static genNote() {
    let genWorker = new Worker(Generator.genWorkerBlobURL);

    // filling array with generated notes
    if (Generator.queueIndex < Generator.QUEUE_SIZE) {
		  genWorker.postMessage({f:Generator.genFunc.toString(), h:Generator.helpers.toString(), s:Generator.scaleNotes, c:Generator.counter});

  		genWorker.onmessage = function(e) {
        Generator.notesQueue[Generator.queueIndex] = e.data.notes;
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

  get notes() {
    return Generator.notes();
  }

  static notes(){
    return Generator.notesQueue.getAndGen();
  }
}
