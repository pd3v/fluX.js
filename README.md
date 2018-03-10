# fluX
A nano API for generative music in the browser.

## How to use it
Add references to **sequencer.js**, **generator.js** and **synth.js** on your website project,

```javascript

<script type="text/javascript" src="sequencer.js"></script>
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript" src="synth.js"></script>

```

and then use it in your code like this,

```javascript
let bluesScale = {'c':0, 'd#':3, 'f':5, 'f#':6, g:7, 'a#':10};
let pattern = [3,3,3,8,8,16,16,4,8];
let scaleLength = Object.values(bluesScale).length;

var ascending = true;

// 'f' function generates a Blues scale's random number of ascending or descending notes
// with velocity changes for expressiveness 
let f = _ => { 
  let scaleIndex = Sequencer.counter%scaleLength;
  if (scaleIndex*Math.random().toFixed(0) == 0) {
    ascending = !ascending;
  }
  
  if (ascending) {
    return {note: scaleIndex, vel:scaleIndex>=2 && scaleIndex<=4? 127: 39, oct: 4};
  } else {
    return {note:scaleLength-scaleIndex-1, vel:scaleLength-scaleIndex-1>=2 && scaleLength-scaleIndex-1<=4? 15: 127, oct:5};
  }
}

// to send those notes to your favorite soft/hard synth
Sequencer.generator(bluesScale, f).MIDIOut('midi port1').start(120, pattern);

// to send those same notes to API's synth 'Synth'
//Sequencer.generator(bluesScale, f).synth('Synth').start(120, pattern);
```
