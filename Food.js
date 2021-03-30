class Food {

  constructor(){
    this.x = floor(random(29))*sizeP;
    this.y = floor(random(29))*sizeP;
    this.pos = new Vectore(this.x,this.y);
  }

  static show(fd){
    fill(250,0,0);
    strokeWeight(0);
    stroke(0);
    rect(fd.x,fd.y,sizeP,sizeP);
  }

  static copy(fd){
    var ff = new Food();
    ff.x = fd.x;
    ff.y = fd.y;
    ff.pos = new Vectore(ff.x,ff.y);
  return ff;
  }
}
