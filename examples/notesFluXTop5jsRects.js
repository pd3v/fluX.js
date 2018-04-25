/*Include the following files in your HTML
<script type="text/javascript" src="midiout.js"></script>
<script type="text/javascript" src="synth.js"></script>
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript" src="sequencer.js"></script>
<script type="text/javascript" src="helpers.js"></script>
<script type="text/javascript" src="p5.min.js"></script>
*/

<script>
var AudioContext = window.AudioContext || window.webkitAudioContext;
var ac = new AudioContext();

const CMajorScale = {c:0, d:2, e:4, f:5, g:7, a:9, b:11};
const scaleLength = Object.values(CMajorScale).length;

const f = _ => {
  const ascDescFlag = round(rand(0,countTo(scaleLength-1)));

  if (ascDescFlag == 0 || ascDescFlag == round(scaleLength/2)) {
    ascending = !ascending;
  }

  if (ascending) {
    return {note: countTo(scaleLength-1), vel:127, dur:8, oct: round(rand(3,5))};
  } else {
    return {note:countFrom(scaleLength-1), vel:127, dur:2**round(rand(3,4)), oct:3};
  }
}

// fluX's built-in synth
Sequencer.generator(CMajorScale, f).synth('Synth',{a:0,d:0,r:0.7}).start(audioContext, 80);
// midi output
// Sequencer.generator(CMajorScale, f).midiOut('midi port1').start(audioContexto, 80);

document.getElementById("code").innerHTML += '<span>'+f+'</span>';

var notesMatrix = [];

function setup() {
  colorMode(HSB);
  noStroke();

  let numOfElemPerRawCol = Math.ceil(Math.sqrt(scaleLength));
  let rectW = window.innerWidth/numOfElemPerRawCol;
  let rectH = window.innerHeight/numOfElemPerRawCol;
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas = document.getElementById("matrix");

  for (let y = 0; y < numOfElemPerRawCol; y++) {
    for (let x = 0; x < numOfElemPerRawCol; x++) {
      notesMatrix.push(new NoteRect(x*rectW,y*rectH,rectW,rectH,Object.values(CMajorScale)[y*numOfElemPerRawCol+x]));
    }
  }
}

function draw() {
  background(0);
  const note = notePlaying(); //helper function or instead use 'Sequencer.notePlaying';

  // matching notesMatrix's rectangle to note being played and display it
  notesMatrix[notesMatrix.findIndex((elem)=>{
      const noteMinusOct = Math.abs(note.note-(note.oct*12)) <= 11 ? note.note-(note.oct*12) : 0;
      return elem.note == noteMinusOct})
  ].display();
}

function NoteRect(x,y,width,height,note) {
  this.x = x;
  this.y = y;
  this.note = note;
  this.width = width;
  this.height = height;

  this.display = function() {
    fill(scaleTo(0,11,0,340,this.note),100,100,0.8);
    rect(this.x,this.y,this.width,this.height);
  };
}
</script>
