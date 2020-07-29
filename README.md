# fluX.js
A javascript engine for generative music in the browser. Check it out "in action" ➫ https://pd3v.github.io/

## How to use it
Add the following references to your website project,

```javascript

<script type="text/javascript" src="sequencer.js"></script>
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript" src="synth.js"></script>
<script type="text/javascript" src="midiout.js"></script>
<script type="text/javascript" src="helpers.js"></script>

```

and then use it in your code like this,

```javascript
// Using helper functions round(), rand(), whenMod() (former countTo()) and revWhenMod (countFrom())
const CMinorScale = {c:0, d:2, ef:3, f:5, g:7, af:8, bf:10};

let f = (notesScale) => {
  let ascending;
  const scaleLength = scaleLen(notesScale);
  const ascDescFlag = round(rand(0,whenMod(scaleLength+1)));

  if (ascDescFlag <= round((scaleLength-1)/2)) {
    ascending = true;
  } else {
    ascending = false;
  }

  if (ascending)
    return {notes:{0:whenMod(scaleLength-1)}, vel:whenMod(scaleLength-1)>=0 && whenMod(scaleLength-1)<=3? 127:39, dur:8, oct:4}; // solo note
  else
    return {notes:{0:revWhenMod(scaleLength-1),1:rand(0,scaleLength)}, vel:revWhenMod(scaleLength-1)>3 && revWhenMod(scaleLength-1)<=scaleLength-1? 15:127, dur:16, oct:2}; // 2 notes
}

// to send those notes to your favorite soft/hard synth
Sequencer.generator(CMinorScale, f).midiOut('midi port1').start(null, 120);

// to send those same notes to fluX's synth 'Synth'
//Sequencer.generator(CMinorScale, f).synth('Synth').start(audiocontext, 120);
```
