/*Include the following files in your HTML -->
<script type="text/javascript" src="midiout.js"></script>
<script type="text/javascript" src="synth.js"></script>
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript" src="sequencer.js"></script>
<script type="text/javascript" src="helpers.js"></script>
<script type="text/javascript" src="p5.min.js"></script>*/

<script>
var AudioContext = window.AudioContext || window.webkitAudioContext;
var ac = new AudioContext();

const CMinorScale = {c:0, d:2, ef:3, f:5, g:7, af:8, bb:10};
const scaleLength = Object.values(CMinorScale).length;

// function composition is using Markov Chains
const composition = scale => {
  let composition = [];
  let phrasings = {};

	for (let i = 0; i < 20; i++){
    composition.push(round(rand(0,Object.keys(scale).length-1)));
	}

  for (let j = 0; j < composition.length-1; j++) {
    if (!phrasings[composition[j]]) {
      phrasings[composition[j]]=[];
    }
    phrasings[composition[j]].push(composition[j+1]);
  }
  return {phrasings, scale};
}

let compositionObj;
const f = _ => {
  let ac = 0;
  let phrasing;
  let note;
  let noteIndex;

  // Every 25 notes generate new phrasings
  if (counter()%25 == 0) {
      compositionObj = composition(CMinorScale);
  }

  phrasing = compositionObj.phrasings[(Object.keys(compositionObj.phrasings))[countTo(Object.keys(compositionObj.phrasings).length-1)]];
  noteIndex = round(rand(0,phrasing.length-1));

  return {
    note:phrasing[noteIndex], // randoms note from phrasing
    vel:127*(1-((noteIndex+1)/(phrasing.length))*0.5), // the smaller the phrasing higher the note's velocity
    dur:2**Math.trunc(rand(1,5)), // the bigger the phrasing shorter the note's duration
    oct:Math.trunc(scaleTo(0,5,3,6,round(phrasing.reduce((accum, value)=>{
      accum += value;
      return accum;
    })/phrasing.length))) // averages the phrasing content
  }
}

Sequencer.generator(CMinorScale, f).synth('Synth',{a:0.0,d:0,r:0.0}).start(audioContext, 120); // built-in synth
// Sequencer.generator(CMinorScale, f).midiOut('midi port1').start(audioContext, 120); // MIDI out to your favorite synth

// Based on p5.js demo.
// This time with circle's color and size changing over time
var x, y;

function setup() {
  colorMode(HSB);

  var myCanvas = createCanvas(window.innerWidth, window.innerHeight);
  // for the following line to work, somewhere on your HTML page should be <canvas id="circleNotes"></canvas>
  myCanvas = document.getElementById("circleNotes");

  // Starts in the middle
  x = width/2;
  y = height;
}

function draw() {
  background(0);

  const note = notePlaying(); //helper function or instead 'Sequencer.notePlaying';

  // Draw a circle with color mapping from note's pitch and size from note's duration
  // fluX's helper function scaleTo(), scaling from MIDI note (32-82) to hue (0-255)
  fill(scaleTo(35,82,0,255,note.note),100,100,0.5);
  // scaleTo() scaling from note duration in miliseconds to pixels
  const circleDiameter = scaleTo(125,2000,window.innerWidth*0.7,40,note.dur);
  ellipse(x, y, circleDiameter, circleDiameter);

  // Jiggling randomly on the horizontal axis
  x = x+random(-1, 1);
  // Moving up at a constant speed
  y = y-1;
  // Reset to the bottom
  if ((y+circleDiameter) <= 0) {
    y = circleDiameter/2+height;
  }
}
</script>
