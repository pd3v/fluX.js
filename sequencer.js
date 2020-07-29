class Sequencer {
  get audioContext() {
    return Sequencer.ac;
  }

  static get notesPlaying() {
    return Sequencer.snotesPlaying;
  }

  static set notesPlaying(value){
    Sequencer.snotesPlaying = value;
  }

  get synth() {
    return Sequencer.synth;
  }

  get midiOutNamePort() {
    return Sequencer.midiOut;
  }

  static set midiOutNamePort(value) {
      Sequencer.midiOut = Function('"use strict";return new MidiOut('+value+')')();
  }

  get generator() {
    return Sequencer.gen;
  }

  static set generator(scale) {
    Sequencer.gen = Function('"use strict"; return new Generator('+JSON.stringify(scale)+','+f+')')();
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

  static beatToMilliSeconds(notesObject){
    const beat = {128: 31.25, 64: 62.5, 32: 125, 16: 250, 8: 500, 6: 666, 3: 333, 4: 1000, 2: 2000, 1: 4000};

    if (Object.keys(notesObject).includes('dur')) {
      notesObject.dur = (beat[notesObject.dur < 128 ? notesObject.dur : 128]/1000)/(Sequencer.sbpm/60)*1000;
    } else {
      Object.assign(notesObject, {dur:(beat[Sequencer.spattern[Sequencer.counter%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60)*1000});
    }

    return notesObject;
  }

  static synth(value, adsr={a:0,d:0,r:0}) {
    if (value != undefined && value != null) {
      Sequencer.synth = value + '('+JSON.stringify(adsr)+')';
      Sequencer.play = function() {
        if (!Sequencer.ac) {
          throw 'No audio context set.';
        }
        const asynth = Function('"use strict"; return new '+Sequencer.synth)();

        asynth.audioContext = Sequencer.ac;

        const notesObject = Sequencer.beatToMiliSeconds(Sequencer.gen.notes);
        asynth.waveType = 'triangle';
        asynth.notes = notesObject.notes;
        asynth.vel = notesObject.vel;
        asynth.adsr = adsr;
        asynth.adsr.s = notesObject.dur/1000;

        Sequencer.notesPlaying = notesObject;

        asynth.connect(scope); // fix
        asynth.connect(Sequencer.ac.destination);
        asynth.start();

        setTimeout(Sequencer.start, notesObject.dur, Sequencer.ac, Sequencer.sbpm, Sequencer.spattern);
      }
      return this;
    }
    return null;
  }

  static midiOut(value) {
    if (value != undefined && value != null) {
      Sequencer.midiOut = Function('"use strict"; return new MidiOut("'+value+'")')();
      Sequencer.play = function() {
        const notesObject = Sequencer.gen.notes;

        Sequencer.notesPlaying = notesObject;

        Sequencer.midiOut.sendNotes(Sequencer.beatToMilliSeconds(notesObject));
        setTimeout(Sequencer.start, Sequencer.beatToMilliSeconds(notesObject.dur), null, Sequencer.sbpm, Sequencer.spattern);
      }
      return this;
    }
    Sequencer.midiOut = null;
    return null;
  }

  static generator(scale, f) {
    Sequencer.counter = 0;
    Sequencer.gen = Function('"use strict"; return new Generator('+JSON.stringify(scale)+','+f+')')();
    return this;
  }

  static start(audioContext, bpm=90, pattern=[4]) {
    Sequencer.ac = audioContext;
    Sequencer.sbpm = bpm;
    Sequencer.spattern = pattern;

    Sequencer.play();

    Sequencer.counter++;
    Sequencer.gen.counter = Sequencer.counter;
  }
}
