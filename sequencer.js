class Sequencer {
  get audioContext() {
    return Sequencer.ac;
  }

  static get notePlaying() {
    return Sequencer.snotePlaying;
  }

  static set notePlaying(value){
    Sequencer.snotePlaying = value;
  }

  get synth() {
    return Sequencer.synth;
  }

  get midiOutNamePort() {
    return Sequencer.midiOut;
  }

  static set midiOutNamePort(value) {
      Sequencer.midiOut = eval('new MidiOut("'+value+'")');
  }

  get generator() {
    return Sequencer.gen;
  }

  static set generator(scale) {
    Sequencer.gen = eval('new Generator('+JSON.stringify(scale)+','+f+')');
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

  static beatToMiliSeconds(noteObject){
    const beat = {128: 31.25, 64: 62.5, 32: 125, 16: 250, 8: 500, 6: 666, 3: 333, 4: 1000, 2: 2000, 1: 4000};

    if (Object.keys(noteObject).includes('dur')) {
      noteObject.dur = (beat[noteObject.dur < 128 ? noteObject.dur : 128]/1000)/(Sequencer.sbpm/60)*1000;
    } else {
      Object.assign(noteObject, {dur:(beat[Sequencer.spattern[Sequencer.counter%Sequencer.spattern.length]]/1000)/(Sequencer.sbpm/60)*1000});
    }

    return noteObject;
  }

  static synth(value, adsr={a:0,d:0,r:0}) {
    if (value != undefined && value != null) {
      Sequencer.synth = value + '('+JSON.stringify(adsr)+')';
      Sequencer.play = function() {
        const asynth = eval('new '+Sequencer.synth);
        if (!Sequencer.ac) {
          throw 'No audio context set.';
        }
        asynth.audioContext = Sequencer.ac;

        const noteObject = Sequencer.beatToMiliSeconds(Sequencer.gen.note);
        asynth.waveType = 'sawtooth';
        asynth.note = noteObject.note;
        asynth.vel = noteObject.vel;
        asynth.adsr = adsr;
        asynth.adsr.s = noteObject.dur/1000;

        Sequencer.notePlaying = noteObject;

        // asynth.connect(scope); // fix
        asynth.connect(Sequencer.ac.destination);
        asynth.start();

        setTimeout(Sequencer.start, noteObject.dur, Sequencer.ac, Sequencer.sbpm, Sequencer.spattern);
      }
      return this;
    }
    return null;
  }

  static midiOut(value) {
    if (value != undefined && value != null) {
      Sequencer.midiOut = eval('new MidiOut("'+value+'")');
      Sequencer.play = function() {
        const noteObject = Sequencer.gen.note;

        Sequencer.notePlaying = noteObject;

        Sequencer.midiOut.sendNote(Sequencer.beatToMiliSeconds(noteObject));
        setTimeout(Sequencer.start, Sequencer.beatToMiliSeconds(noteObject.dur), null, Sequencer.sbpm, Sequencer.spattern);
      }
      return this;
    }
    Sequencer.midiOut = null;
    return null;
  }

  static generator(scale, f) {
    Sequencer.counter = 0;
    Sequencer.gen = eval('new Generator('+JSON.stringify(scale)+','+f+')');
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
