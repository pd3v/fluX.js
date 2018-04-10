let CMinorScale = {c:0, d:2, ef:3, f:5, g:7, af:8, bb:10};
let scaleLength = Object.values(CMinorScale).length;

// generate a musical random mayhem of notes, velocity, duration and octaves!
// :)
let f = _ => {
  let octave = (Math.random()*4).toFixed(0);
  return {
    note:(Math.random()*(scaleLength-1)).toFixed(0),
    vel:(Math.random()*87+38).toFixed(0),
    dur:2**(Math.random()*3+2).toFixed(0),
    oct:octave != 1 ? octave : 3
  };
}

// Sending to MIDI output port. Connect your favorite synth.
Sequencer.generator(CMinorScale, f).midiOut('midi port1').start(120);
