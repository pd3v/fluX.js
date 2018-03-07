class MidiOut {
  constructor(midiOutNamePort){
    // midiOutNamePort param not being used for now
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
  
  sendNote(noteObject) {
    if (MidiOut.moutputMIDI != undefined) {
      var noteOnMessage = [0x90, noteObject.note, noteObject.vel]; 
      let noteOffMessage = [0x80, noteObject.note, 0x00];
      
      MidiOut.moutputMIDI.send(noteOnMessage);
      MidiOut.moutputMIDI.send(noteOffMessage, window.performance.now()+noteObject.dur); 
    }
  }
 
  success(midi) {
    MidiOut.allmidi = midi;
    
    for (var out of MidiOut.allmidi.outputs.values()) {
      MidiOut.moutputMIDI = out;
      break;
    }
  }
  
  failure() {
    console.log('No MIDI found');
  } 

  onMIDIMessage (message) {
    console.log('onMIDIMessage', message.data);
  }
}
