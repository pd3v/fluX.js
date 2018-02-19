let bluesScale = {'c':0, 'd#':3, 'f':5, 'f#':6, g:7, 'a#':10};
let pattern = [3,3,3,8,8,16,16,4,8];
let scaleLength = Object.values(bluesScale).length;

var ascending = true;

// generate a Blues scale's random number of ascending or descending notes
// with velocity changes for expressiveness 
let f = _ => { 
  let scaleIndex = Sequencer.counter%scaleLength;
  if (scaleIndex*Math.random().toFixed(0) == 0) {
    ascending = !ascending;
  }
  
  if (ascending) {
    return {note: scaleIndex, vel:scaleIndex>=2 && scaleIndex<=4? 127: 39, octave: 4};
  } else {
    return {note:scaleLength-scaleIndex-1, vel:scaleLength-scaleIndex-1>=2 && scaleLength-scaleIndex-1<=4? 15: 127, octave:5};
  }
}

Sequencer.generator(bluesScale, f).synth('Synth').start(120, pattern);
