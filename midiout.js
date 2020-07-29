class MidiOut {
  constructor(midiOutNamePort){
		MidiOut.namePort = midiOutNamePort;

    if (navigator.requestMIDIAccess)
      navigator.requestMIDIAccess().then(this.success, this.failure);
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

  sendNotes(notesObject) {
    if (MidiOut.moutputMIDI != undefined) {
      Object.keys(notesObject.notes).forEach(function(k) {
        MidiOut.moutputMIDI.send([0x90, notesObject.notes[k], notesObject.vel]);
      });

      Object.keys(notesObject.notes).forEach(function(k) {
        MidiOut.moutputMIDI.send([0x80, notesObject.notes[k], 0x00],performance.now()+notesObject.dur);
      });
    }
  }

  failure() {
    throw 'No MIDI found';
  }

  onMIDIMessage (message) {
    console.log('onMIDIMessage ', message.data);
  }
}
