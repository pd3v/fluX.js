// Helper functions
const counterSeq = _ => {
  return Sequencer.counter;
}

const counter = _ => {
  return Generator.counter;
}

const countTo = countTurn => {
  return Generator.counter%(countTurn+1);
}

const countFrom = countTurn => {
  return countTurn-(Generator.counter%(countTurn+1));
}

const linear = (from, to, spread=to) => {
  const asc = from <= to ? true : false;
  let accum = asc ? from : to;

  if (asc) {
    accum += countTo(spread)*((to-from)/(spread-1));
  } else {
    if (spread == to) {spread = from};
    accum += countFrom(spread)*((from-to)/(spread-1));
  }
  return accum;
}

const rand = (min=0, max=1) => {
  return (Math.random()*(max-min)+min);
}

const round = (number, precision=0) => {
  var factor = Math.pow(10, precision);
  return Math.round(number*factor)/factor;
}

const scaleTo = (min, max, minTo, maxTo, value) => {
  return ((value-min)/(max-min))*(maxTo-minTo)+minTo;
}

// a shorter console.log()
const cl = s => {
  return console.log(s);
}
