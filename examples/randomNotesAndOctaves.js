let bluesScale = {'c':0, 'd#':3, 'f':5, 'f#':6, g:7, 'a#':10};
let pattern = [3,3,3,8,8,16,16,4,8];
let scaleLength = Object.values(bluesScale).length;

// generate Blues scale random notes and random octaves
let f = _ => {
  let randomNote = (Math.random()*Sequencer.counter%(scaleLength-1)).toFixed(0);
  let randomOctave = Math.random()*3+2;
  return {note: randomNote, octave: randomOctave};
}

Sequencer.generator(bluesScale, f).synth('Synth').start(120, pattern);
