function activate(a){
  b = math.zeros(a._data.length,a._data[0].length);
  for (i = 0;i < a._data.length;i++){
    for (j = 0;j < a._data[i].length;j++){
      b._data[i][j] = max(0,a._data[i][j]) //1/(1+exp((-1)*a._data[i][j]));
    }
  }
  return b;
}

class NeuralNetwork {

  constructor(input,hidden,output,layers){
    this.iNodes = input;
    this.hNodes = hidden;
    this.oNodes = output;
    this.hLayers = layers;
    this.weights = math.ones(this.hLayers+1);
    this.weights._data[0] = math.ones(this.hNodes,this.iNodes+1);
    for (var i = 1; i < this.hLayers;i++){
      this.weights._data[i] = math.ones(this.hNodes, this.hNodes+1);
    }
    this.weights._data[this.weights._data.length-1] = math.ones(this.oNodes, this.hNodes + 1);
    for (var i = 0; i < this.weights._size[0];i++){
      for (var j = 0; j < this.weights._data[i]._size[0];j++){
        for (var k = 0; k < this.weights._data[i]._size[1];k++) {
          this.weights._data[i]._data[j][k] = random(-1,1);
        }
      }
    }
  }

  static mutate(nn,mutation_rate) {
    for (var i = 0; i < nn.weights._size[0]; i++){
      for (var j = 0; j < nn.weights._data[i]._size[0];j++){
        for (var k = 0; k < nn.weights._data[i]._size[1];k++){
          var rand = random(1);
          if (rand<mutation_rate){
            nn.weights._data[i]._data[j][k] += randomGaussian()/5;
            if (nn.weights._data[i]._data[j][k] > 1){
              nn.weights._data[i]._data[j][k] = 1;
            }
            if (nn.weights._data[i]._data[j][k] < -1){
              nn.weights._data[i]._data[j][k] = -1;
            }
          }
        }
      }
    }
  }

  static guess(nn,entradas){
    var inputs = math.zeros(entradas.length+1,1);
    for (i = 0; i < entradas.length;i++){
      inputs._data[i][0] = entradas[i];
    }
    inputs._data[entradas.length][0] = 1;
    for (i = 0; i < nn.hLayers; i++){
      var hddi = math.multiply(nn.weights._data[i],inputs);
      var hddo = activate(hddi);
      inputs = hddo.resize([hddo._data.length+1,1],1);
    }
    var outi = math.multiply(nn.weights._data[nn.weights._data.length-1],inputs);
    var guess = activate(outi);
    return guess;
  }

  static crossover(partner1,partner2){
    var child = new NeuralNetwork(partner1.iNodes,partner1.hNodes,partner1.oNodes,partner1.hLayers);

    for (var i = 0; i < partner1.weights._data.length;i++){
      var randj = floor(random(partner1.weights._data[i]._data.length+.9));
      var randk = floor(random(partner1.weights._data[i]._data[0].length+.9));
      for (var j = 0; j < partner1.weights._data[i]._data.length; j++){
        for (var k = 0; k < partner1.weights._data[i]._data[j].length; k++){
          if (j > randj || (j == randj && k >= randk)){
            child.weights._data[i]._data[j][k] = partner1.weights._data[i]._data[j][k];
          } else {
            child.weights._data[i]._data[j][k] = partner2.weights._data[i]._data[j][k];
          }
          /*var rand = random(1);
          if (rand > 0.5){
            child.weights._data[i]._data[j][k] = partner1.weights._data[i]._data[j][k];
          }
          else{
            child.weights._data[i]._data[j][k] = partner2.weights._data[i]._data[j][k];
          }*/
        }
      }
    }
    return child;
  }

  static copy(nn){
    var copycat = new NeuralNetwork(nn.iNodes,nn.hNodes,nn.oNodes,nn.hLayers);
    for (var i = 0; i < nn.weights._data.length;i++){
      for (var j = 0; j < nn.weights._data[i]._data.length; j++){
        for (var k = 0; k < nn.weights._data[i]._data[j].length; k++){
          copycat.weights._data[i]._data[j][k] = nn.weights._data[i]._data[j][k];
        }
      }
    }
    return copycat;
  }

  static show(x,y,w,h,nn){

    nn.nSize = (h/(nn.iNodes*2));
    y += ((h-(nn.nSize*((nn.iNodes*2)-1))+nn.nSize)/2);
    x += (nn.nSize/2);
    nn.wSpace = (2*((w-((nn.hLayers+2)*nn.nSize))/(nn.hLayers+1)));
    x += nn.wSpace/3;
    for (i = 0; i < nn.weights._data[0]._size[0];i++){
      for (j = 0; j <nn.weights._data[0]._size[1]-1;j++){
        if (nn.weights._data[0]._data[i][j] > 0){
          stroke("blue");
          strokeWeight(1*nn.weights._data[0]._data[i][j]);
        } else{
          stroke("red");
          strokeWeight(-1*nn.weights._data[0]._data[i][j]);
        }
        line(x,y+j*2*nn.nSize,x + (nn.wSpace + nn.nSize/2), y + ((h-(nn.nSize*((nn.hNodes*2)-1))+nn.nSize)/2) - ((h-(nn.nSize*((nn.iNodes*2)-1))+nn.nSize)/2) + i*2*nn.nSize)
      }
    }

    for (i = 0;i < nn.iNodes;i++){
      strokeWeight(1);
      stroke(0);
      fill(255,99,97);
      ellipse(x,y+i*2*nn.nSize,nn.nSize+5,nn.nSize+5);
      fill(255,166,0);
      ellipse(x,y+i*2*nn.nSize,nn.nSize-3,nn.nSize-3);
    }

    y += ((h-(nn.nSize*((nn.hNodes*2)-1))+nn.nSize)/2) - ((h-(nn.nSize*((nn.iNodes*2)-1))+nn.nSize)/2);
    for (var k = 1; k < nn.hLayers;k++){
      for (i = 0; i < nn.weights._data[k]._size[0];i++){
        for (j = 0; j <nn.weights._data[k]._size[1]-1;j++){
          if (nn.weights._data[k]._data[i][j] > 0){
            stroke("blue");
            strokeWeight(1*nn.weights._data[k]._data[i][j]);
          } else{
            stroke("red");
            strokeWeight(-1*nn.weights._data[k]._data[i][j]);
          }
          line(x + (k*(nn.wSpace + nn.nSize/2)),y+j*2*nn.nSize,x + ((k+1)*(nn.wSpace + nn.nSize/2)), y + i*2*nn.nSize)
        }
      }
    }
    for (i = 0; i < nn.weights._data[nn.weights._size[0]-1]._size[0];i++){
        for (j = 0; j <nn.weights._data[nn.weights._size[0]-1]._size[1]-1;j++){
          if (nn.weights._data[nn.weights._size[0]-1]._data[i][j] > 0){
            stroke("blue");
            strokeWeight(1*nn.weights._data[nn.weights._size[0]-1]._data[i][j]);
          } else{
            stroke("red");
            strokeWeight(-1*nn.weights._data[nn.weights._size[0]-1]._data[i][j]);
          }
          line(x + ((nn.weights._size[0]-1)*(nn.wSpace + nn.nSize/2)),y+j*2*nn.nSize,x + ((nn.weights._size[0])*(nn.wSpace + nn.nSize/2)), y + (i+1)*2*nn.nSize +(nn.iNodes-nn.oNodes)*nn.nSize/2)
        }
    }
    for (i = 1; i <nn.hLayers+1;i++){
      for (j = 0; j < nn.hNodes;j++){
        strokeWeight(1);
        stroke(0);
        fill(255,99,97);
        ellipse(x + (i*(nn.wSpace + nn.nSize/2)),y + j*2*nn.nSize,nn.nSize+5,nn.nSize+5);
        fill(255,166,0);
        ellipse(x + (i*(nn.wSpace + nn.nSize/2)),y + j*2*nn.nSize,nn.nSize-3,nn.nSize-3);
      }
    }

    y += ((h-(nn.nSize*((nn.oNodes*2)-1))+nn.nSize)/2) - ((h-(nn.nSize*((nn.hNodes*2)-1))+nn.nSize)/2);
    for (i = 0; i < nn.oNodes;i++){
      strokeWeight(1);
      stroke(0);
      fill(255,99,97);
      ellipse(x + ((nn.hLayers+1)*(nn.wSpace + nn.nSize/2)), y + i*2*nn.nSize,nn.nSize+5,nn.nSize+5);
      fill(255,166,0);
      ellipse(x + ((nn.hLayers+1)*(nn.wSpace + nn.nSize/2)), y + i*2*nn.nSize,nn.nSize-3,nn.nSize-3);
    }
  }
}
