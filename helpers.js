// Helper functions
const counter = _ => {
  return Sequencer.counter;
}

const countTo = countTurn => {
  return Sequencer.counter%(countTurn+1);
}

const countFrom = countTurn => {
  return countTurn-(Sequencer.counter%(countTurn+1));
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
