class MidiOut {
  constructor(midiOutNamePort){
		MidiOut.namePort = midiOutNamePort;

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(this.success, this.failure);
    }
  }

  get outputMIDI() {
    return this.moutputMIDI;
  }

  set outputMIDI(value){
    this.moutputMIDI = value;
  }

  success(midi) {
    MidiOut.allmidi = midi;

  	for (var out of MidiOut.allmidi.outputs.values()) {
			if (out.name == MidiOut.namePort) {
    		MidiOut.moutputMIDI = out;
    		break;
			} else {
				throw `"${MidiOut.namePort}" not a MIDI output.`;
			}
  	}
  }

  sendNote(noteObject) {
    if (MidiOut.moutputMIDI != undefined) {
      const noteOnMessage = [0x90, noteObject.note, noteObject.vel];
      const noteOffMessage = [0x80, noteObject.note, 0x00];

      MidiOut.moutputMIDI.send(noteOnMessage);
      MidiOut.moutputMIDI.send(noteOffMessage, window.performance.now()+noteObject.dur);
    }
  }

  failure() {
    throw 'No MIDI found';
  }

  onMIDIMessage (message) {
    console.log('onMIDIMessage ', message.data);
  }
}
