// Using helper functions round(), rand(), countTo() and countFrom()
const CMinorScale = {'c':0, 'd':2, 'ef':3, 'f':5, 'g':7, 'af':8, 'bb':10};
const scaleLength = Object.values(CMinorScale).length;

let ascending = true;

const f = _ => {
  const ascDescFlag = round(rand(0,countTo(scaleLength-1)));

  if (ascDescFlag == 0 || ascDescFlag == round(scaleLength/2)) {
    ascending = !ascending;
  }

  if (ascending) {
    return {note: countTo(scaleLength-1), vel:countTo(scaleLength-1)>=2 && countTo(scaleLength-1)<=4? 127: 39, oct: 4};
  } else {
    return {note:countFrom(scaleLength-1), vel:countFrom(scaleLength-1)>=2 && countFrom(scaleLength-1)<=4? 15: 127, dur:1, oct:2};
  }
}

Sequencer.generator(CMinorScale,f).midiOut('midi port1').start(120);
