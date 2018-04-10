let bluesScale = {c:0, d#:3, f:5, f#:6, g:7, a#:10};
let pattern = [3,3,3,8,8,16,16,4,8];
let scaleLength = Object.values(bluesScale).length;

var noteInc = 0;
let f = _ => {
  if (Sequencer.counter%12 == 0) {
    return {note:(noteInc++)%scaleLength, vel:100 ,oct:3};
  } else {
    return {note:Sequencer.counter%scaleLength, vel:100, oct:5};
  }
}

Sequencer.generator(bluesScale, f).synth('Synth').start(120, pattern);
