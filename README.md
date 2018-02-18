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
// Example #1
let bluesScale = {'c':'0', 'd#':'3', 'f':'5', 'f#':'6', 'g':'7', 'a#':'10'};
Sequencer.generator(bluesScale).synth('Synth').start(120, [8,8,4,16,16,16,16]);

```

being 'Synth' the synthesizer, 120, the bpm, and [8,8,4,16,16,16,16], the rhythm pattern with 1/8, 1/4, 1/16 notes. There are also, 1/4's 1/3, 1/2, and 1 notes. 

```javascript
// but more interesting,
// if you want to custom your generative algorithm
// Example #2

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

Sequencer.generator(bluesScale, f).synth('Synth').start(120, pattern)
```
