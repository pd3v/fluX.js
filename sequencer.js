class Sequencer {
  constructor(ac){}

  get synth() {
    return Sequencer.synth;
  }

  static set synth(value) {
    Sequencer.synth = value + '(ac)';
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

  static synth(value) {
    if (value != undefined && value != null) {
      Sequencer.synth = value + '(ac)';

      Sequencer.play = function() {
        const asynth = eval('new '+Sequencer.synth);
        const noteObject = Sequencer.beatToMiliSeconds(Sequencer.gen.note);

        asynth.note = noteObject.note;
        asynth.vel = noteObject.vel;
        asynth.adsr = [0.0, 0.0, noteObject.dur, 0.01];

        asynth.connect(analyser);
        asynth.connect(ac.destination);

        asynth.start(ac.currentTime+asynth.adsr[0]);
        asynth.stop(ac.currentTime+noteObject.dur/1000);

        asynth.osc.onended = function() {
          setTimeout(Sequencer.start, 0, Sequencer.sbpm, Sequencer.spattern);
        };
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

        Sequencer.midiOut.sendNote(Sequencer.beatToMiliSeconds(noteObject));
        setTimeout(Sequencer.start, Sequencer.beatToMiliSeconds(noteObject.dur), Sequencer.sbpm, Sequencer.spattern);
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

  static start(bpm=90, pattern=[4]) {
    Sequencer.sbpm = bpm;
    Sequencer.spattern = pattern;

    if (!Sequencer.play || Sequencer.play == null) {
      throw 'No synth or MIDI output set.'
    }

    Sequencer.play();

    Sequencer.counter++;
    Sequencer.gen.counter = Sequencer.counter;
  }
}
