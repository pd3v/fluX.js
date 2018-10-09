// Helper functions

let helpers = ((context,step) => {
    context.step = step;
    context.log = console.log.bind(console);

    context.rand = (min=0, max=1) => {return (Math.random()*(max-min)+min)}

    context.round = (number, precision=0) => {
      var factor = Math.pow(10, precision);
      return Math.round(number*factor)/factor;
    }

    context.countTurn = countTurn => {
      return step%(countTurn+1);
    }

    //whenMod, alias for countTurn as in TidalCycles
    context.whenMod = context.countTurn;

    context.countFrom = countTurn => {
      return countTurn-(step%(countTurn+1));
    }

    //revWhenMod, alias for countFrom as in TidalCycles
    context.revWhenMod = countFrom;

    context.scaleTo = (min, max, minTo, maxTo, value) => {
      return Math.abs(((value-min)/(max-min))*(maxTo-minTo)+minTo);
    }

    context.scaleLen = scale => {
      return Object.values(scale).length;
    }

    context.linear = (from, to, spread=to) => {
      const asc = from <= to ? true : false;
      let accum = asc ? from : to;

      if (asc) {
        accum += whenMod(spread)*((to-from)/(spread));
      } else {
        if (spread == to) {spread = from};
        accum += revWhenMod(spread)*((from-to)/(spread));
      }
      return accum;
    }
    //saw, alias for linear
    context.saw = context.linear;
});

// a shorter console.log()
var log = console.log.bind(console);

const notePlaying = _ => {
  return Sequencer.snotePlaying;
}
