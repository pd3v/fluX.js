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

let bluesScale = {'c':'0', 'd#':'3', 'f':'5', 'f#':'6', 'g':'7', 'a#':'10'};
let pattern = [16];
var ascending = true;

// generative function
let f = _ => { 
  if (Sequencer.counter%scaleLength == 0) {
      ascending = !ascending;
  }
  
  if (ascending) {
    return {note:(Sequencer.counter%scaleLength), octave: 4};
  } else {
    return {note:scaleLength-Sequencer.counter%scaleLength-1, octave:5};
  }
}
Sequencer.generator(bluesScale, f).synth('Synth').start(120, pattern)
```
