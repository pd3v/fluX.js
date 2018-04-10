# fluX
A nano API for generative music in the browser. Check it out "in action" ➫ https://pd3v.github.io/

## How to use it
Add references into your website project,

```javascript

<script type="text/javascript" src="sequencer.js"></script>
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript" src="synth.js"></script>
<script type="text/javascript" src="midiout.js"></script>
<script type="text/javascript" src="helpers.js"></script>

```

and then use it in your code like this,

```javascript
// Using helper functions round(), rand(), countTo() and countFrom()
const CMinorScale = {c:0, d:2, ef:3, f:5, g:7, af:8, bb:10};
const scaleLength = Object.values(CMinorScale).length;

let ascending = true;

const f = _ => {
  const ascDescFlag = round(rand(0,countTo(scaleLength-1)));

  if (ascDescFlag == 0 || ascDescFlag == round(scaleLength/2)) {
    ascending = !ascending;
  }

  if (ascending) {
    return {note: countTo(scaleLength-1), vel:countTo(scaleLength-1)>=2 && countTo(scaleLength-1)<=4? 127: 39, dur:8, oct: 4};
  } else {
    return {note:countFrom(scaleLength-1), vel:countFrom(scaleLength-1)>=2 && countFrom(scaleLength-1)<=4? 15: 127, dur:1, oct:2};
  }
}

// to send those notes to your favorite soft/hard synth
Sequencer.generator(CMinorScale, f).MIDIOut('midi port1').start(120, pattern);

// to send those same notes to fluX's synth 'Synth'
//Sequencer.generator(CMinorScale, f).synth('Synth').start(120, pattern);
```
