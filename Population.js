class Population{

  constructor(sz,lay){
    this.snakesA = new Array(sz);
    for (var i = 0;i < sz;i++){
      this.snakesA[i] = new Snake(lay,[1]);
    }
    this.bestSnake = Snake.copy(this.snakesA[0]);
    this.bestSnake.replay = true;
    this.gen = 1;
    this.done = false;
  }

  static done(popu){
    popu.done = true;
    for (var i = 0; i < popu.snakesA.length;i++){
      if (!popu.snakesA[i].dead){
        popu.done = false;
      }
    }
    if (!popu.bestSnake.dead){
      popu.done = false;
    }
    return popu.done;
  }

  static calcFit(popu){
    popu.fitsum = 0;
    for (var i = 0; i < popu.snakesA.length;i++){
      Snake.calcFit(popu.snakesA[i]);
      popu.fitsum += popu.snakesA[i].fit;
    }
  }

  static selNatural(popu){
    var newSnakes = new Array(indv);

    var max = 0;
    var maxI = 0;
    for (var i = 0; i < popu.snakesA.length;i++){
      if (popu.snakesA[i].fit > max){
        max = popu.snakesA[i].fit;
        maxI = i;
      }
    }
      if (max > bestFit){
        popu.bestSnake = Snake.cloneR(popu.snakesA[maxI]);
        bestFit = max;
        bestSnakeScore = popu.snakesA[maxI].score;
      } else {
        popu.bestSnake = Snake.cloneR(popu.bestSnake);
      }


    newSnakes[0] = Snake.copy(popu.bestSnake);
    for (var i = 1; i < newSnakes.length;i++){
      var child = Snake.crossover(Population.selS(popu),Population.selS(popu));
      Snake.mutate(child);
      newSnakes[i] = Snake.copy(child);
    }
    popu.done = false;
    popu.snakesA = newSnakes;
    popu.gen += 1;
  }

  static selS(pp){
    var rand = random(pp.fitsum);
    var sum = 0;
    for (var i = 0; i < pp.snakesA.length;i++){
      sum += pp.snakesA[i].fit;
      if (sum > rand){
        return pp.snakesA[i];
      }
    }
    return pp.snakesA[0];
  }

  static show(popu){
    if (replay){
      Snake.show(popu.bestSnake);
      NeuralNetwork.show(586,0,200,580,popu.bestSnake.brain);
    } else {
      for (var s = 0; s < popu.snakesA.length; s++){
        Snake.show(popu.snakesA[s]);
      }
    }
  }

  static upp(popu){
    if (!popu.bestSnake.dead){
      Snake.olhar(popu.bestSnake);
      Snake.think(popu.bestSnake);
      Snake.move(popu.bestSnake);
    }
    for (var i = 0; i < popu.snakesA.length;i++){
      if (!popu.snakesA[i].dead){
        Snake.olhar(popu.snakesA[i]);
        Snake.think(popu.snakesA[i]);
        Snake.move(popu.snakesA[i]);
      }
    }
  }

}
