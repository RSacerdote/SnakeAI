class Snake {

  constructor(hlayers, rfood){
    this.head = Vectore(280,280);
    this.lifeLeft = 200;
    this.lifeTime = 0;
    this.VelX = 0;
    this.VelY = -sizeP;
    this.fit = 0;
    this.score = 0;
    this.dead = false;
    this.finte = 0;
    if (rfood[0] == 1){
      this.food = new Food();
    } else {
      this.food = rfood[this.finte];
      this.finte++;
    }
    this.body = [];
    if (!human){
      this.vision = new Array(24);
      this.decision = new Array(4);
      this.foodList = [];
      this.foodList.push(Food.copy(this.food));
      this.brain = new NeuralNetwork(24,hidden_nodes,4,hlayers);
      this.body.push(new Vectore(280,280+sizeP));
      this.body.push(new Vectore(280,280+sizeP*2));
      this.body.push(new Vectore(280,280+sizeP*3));
      this.score += 0;
    }
  }

  static show(snk){
    Food.show(snk.food);
    fill(255,255,255);
    stroke(0);
    strokeWeight(1);
    rect(snk.head["x"],snk.head["y"],sizeP,sizeP);
    fill(255,255,255,50);
    for (i = 0; i < snk.body.length;i++){
      rect(snk.body[i]["x"],snk.body[i]["y"],sizeP,sizeP);
    }
  }

  static move(snk){
    if (!snk.dead){
      if (!human){
        snk.lifeLeft--;
        snk.lifeTime++;
      }
      if (Snake.foodCollide(snk.head["x"],snk.head["y"],snk.food)){
        Snake.eat(snk);
      }
      Snake.movement(snk);
      if (Snake.wallCollide(snk.head["x"],snk.head["y"]) || Snake.bodyCollide(snk.head["x"],snk.head["y"],snk) || snk.lifeLeft <= 0){
        snk.dead = true;
      }
    }
  }

  static eat(snk){
    snk.score++;
    if (!human){
      if (snk.lifeLeft<500){
        if (snk.lifeLeft >400){
          snk.lifeLeft = 500;
        } else {
          snk.lifeLeft += 100;
        }
      }
    }
    snk.body.push(new Vectore(snk.body[snk.body.length-1]["x"],snk.body[snk.body.length-1]["y"]));
    if (!replay){
      snk.food = new Food();
      while (Snake.bodyCollide(snk.food.x,snk.food.y,snk)){
        snk.food = new Food();
      }
      if (!human){
        snk.foodList.push(snk.food);
      }
    } else {
      snk.food = snk.foodList[snk.finte];
      if (snk.food == undefined){
        snk.food = new Food();
      }
      snk.finte++;
    //  snk.food = new Food();
    }
  }

  static movement(snk){
    var tempx = snk.head["x"];
    var tempy = snk.head["y"];
    snk.head["x"] += snk.VelX;
    snk.head["y"] += snk.VelY;
    for (i = 0; i < snk.body.length;i++){
      var temp2x = snk.body[i]["x"];
      var temp2y = snk.body[i]["y"];
      snk.body[i]["x"] = tempx;
      snk.body[i]["y"] = tempy;
      tempx = temp2x;
      tempy = temp2y;
    }
  }

  static wallCollide(x,y){
    if ((x < 0 || x >= 580) || (y < 0 || y >= 580)){
      return true;
    }
    return false;
  }

  static foodCollide(x,y,fd){
    if (fd.x == x && fd.y == y){
      return true;
    }
    return false;
  }

  static bodyCollide(x,y,snk){
    for (i = 0; i < snk.body.length;i++){
      if (x == snk.body[i]["x"] && y == snk.body[i]["y"]){
        return true;
      }
    }
    return false;
  }

  static cloneR(snk){
    var copycat = new Snake(snk.brain.hLayers,snk.foodList);
    copycat.brain = NeuralNetwork.copy(snk.brain);
    return copycat;
  }

  static copy(snk){
    var copi = new Snake(snk.brain.hLayers,[1]);
    copi.brain = NeuralNetwork.copy(snk.brain);
    return copi;
  }

  static crossover(snk1,snk2){
    var child = Snake.copy(snk1);
    child.brain = NeuralNetwork.crossover(snk1.brain,snk2.brain);
    return child;
  }

  static mutate(snk){
    NeuralNetwork.mutate(snk.brain,mutateRt);
  }

  static think(snk){
    snk.decision = NeuralNetwork.guess(snk.brain,snk.vision);
    snk.maxI = -1;
    snk.max = 0;
    for (i = 0; i < snk.decision._data.length;i++){
      if (snk.decision._data[i] > snk.max){
        snk.max = snk.decision._data[i][0];
        snk.maxI = i;
      }
    }
    switch (snk.maxI) {
      case 0:
        Snake.moveLeft(snk);
        break;
      case 1:
        Snake.moveUp(snk);
        break;
      case 2:
        Snake.moveDown(snk);
        break;
      case 3:
        Snake.moveRight(snk);
        break;
    }
  }

  static moveUp(snk){
    if (snk.VelY != sizeP){
      snk.VelY = -sizeP;
      snk.VelX = 0;
    }
  }

  static moveDown(snk){
    if (snk.VelY != -sizeP){
      snk.VelY = sizeP;
      snk.VelX = 0;
    }
  }

  static moveLeft(snk){
    if (snk.VelX != sizeP){
      snk.VelX = -sizeP;
      snk.VelY = 0;
    }
  }

  static moveRight(snk){
    if (snk.VelX != -sizeP){
      snk.VelX = sizeP;
      snk.VelY = 0;
    }
  }

  static olhar(snk){
    snk.vision = new Array(24);
    var temp = Snake.LookInDirection(snk,new Vectore(sizeP,0));
    snk.vision[0] = temp[0];
    snk.vision[1] = temp[1];
    snk.vision[2] = temp[2];
    temp = Snake.LookInDirection(snk,new Vectore(sizeP,sizeP));
    snk.vision[3] = temp[0];
    snk.vision[4] = temp[1];
    snk.vision[5] = temp[2];
    temp = Snake.LookInDirection(snk,new Vectore(0,sizeP));
    snk.vision[6] = temp[0];
    snk.vision[7] = temp[1];
    snk.vision[8] = temp[2];
    temp = Snake.LookInDirection(snk,new Vectore(-sizeP,sizeP));
    snk.vision[9] = temp[0];
    snk.vision[10] = temp[1];
    snk.vision[11] = temp[2];
    temp = Snake.LookInDirection(snk,new Vectore(-sizeP,0));
    snk.vision[12] = temp[0];
    snk.vision[13] = temp[1];
    snk.vision[14] = temp[2];
    temp = Snake.LookInDirection(snk,new Vectore(-sizeP,-sizeP));
    snk.vision[15] = temp[0];
    snk.vision[16] = temp[1];
    snk.vision[17] = temp[2];
    temp = Snake.LookInDirection(snk,new Vectore(0,-sizeP));
    snk.vision[18] = temp[0];
    snk.vision[19] = temp[1];
    snk.vision[20] = temp[2];
    temp = Snake.LookInDirection(snk,new Vectore(sizeP,-sizeP));
    snk.vision[21] = temp[0];
    snk.vision[22] = temp[1];
    snk.vision[23] = temp[2];
  }

  static LookInDirection(snk,vec){
    var tempo = new Array(3);
    var pos = new Vectore(snk.head["x"],snk.head["y"]);
    var distance = 0;
    var achoComida =false;
    var achoCorpo = false;
    pos["x"] += vec["x"];
    pos["y"] += vec["y"];
    distance += 1;
    tempo[0] = 0;
    tempo[1] = 0;
  //  tempo[0] = 1/29;
    //tempo[1] = 1/29;
    while (!Snake.wallCollide(pos["x"],pos["y"])){
      if (Snake.foodCollide(pos["x"],pos["y"],snk.food)){
        achoComida =true;
        //tempo[0] = 1/distance;
        tempo[0] = 1;
      }
      if (Snake.bodyCollide(pos["x"],pos["y"],snk)){
        achoCorpo = true;
        //tempo[1] = 1/distance;
        tempo[1] = 1;
      }
      pos["x"] += vec["x"];
      pos["y"] += vec["y"];
      distance += 1;
    }
    tempo[2] = 1/distance;
    return tempo;
  }

  static calcFit(snk){
    if (snk.score < 10){
      snk.fit = floor(snk.lifeTime*snk.lifeTime) * (2 ** snk.score);
    } else {
      snk.fit = floor(snk.lifeTime ** 2);
      snk.fit *= 1024;
      snk.fit *= (snk.score-9);
    }
  }

}
