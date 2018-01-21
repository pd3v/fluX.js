# fluX
A nano API for generative music in the browser.

## How to use it
Add references to both **sequencer.js** and **synth.js** on your website project,

```javascript

<script type="text/javascript" src="synth.js"></script>

<script type="text/javascript" src="sequencer.js"></script>

```

and then use it in your code like this,


```javascript

Sequencer.synth('Synth').start(120, [8,8,4,16,16,16,16]);

```

being 'Synth' the synthesizer, 120, the bpm, and [8,8,4,16,16,16,16], the rhythm pattern with 1/8, 1/4, 1/16 notes. There are also, 1/4's 1/3, 1/2, and 1 notes. 



