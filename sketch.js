sizeP = 20;
human = false;
hidden_nodes = 16;
layersh = 2;
replay = true;
mutateRt = 0.10;
fR = 1000;
indv= 2000;
bestscore = 0;
bestFit = 0;
bestSnakeScore = 0;
fileIt = 1;
load = true;
score = 0;

function start(){
	if (load){
		console.log("Cobra carregada. Último score:", score);
		wcsv = [];
		for (var i = 0; i < 3;i++){
			wcsv[i] = [];
		}
		for (var i = 0; i < 16;i++){
			append(wcsv[0],[]);
		}
		for (var i = 0; i < 16;i++){
			append(wcsv[1],[]);
		}
		for (var i = 0; i < 4; i++){
			append(wcsv[2],[]);
		}

		melhorCobra = new Snake(layersh,[1]);

		for (var i = 0; i < 16;i++){
			for (var j = 0; j < 25; j++){
				wcsv[0][i][j] = w0csv.getNum(i,j);
			}
		}
		for (var i = 0; i < 16;i++){
			for (var j = 0; j < 17; j++){
				wcsv[1][i][j] = w1csv.getNum(i,j);
			}
		}
		for (var i = 0; i < 17;i++){
			for (var j = 0; j < 4; j++){
				wcsv[2][j][i] = w2csv.getNum(j,i);
			}
		}
		for (var i = 0; i < melhorCobra.brain.weights._data.length;i++){
			for (var j = 0; j < melhorCobra.brain.weights._data[i]._data.length;j++){
				for (var k = 0; k < melhorCobra.brain.weights._data[i]._data[j].length;k++){
					melhorCobra.brain.weights._data[i]._data[j][k] = wcsv[i][j][k];
				}
			}
		}
	}
	else{
		popu = new Population(indv,layersh);
	}
}
function Vectore(a,b){
	vec = {
		x: a,
		y: b
	}
	return vec;
}

function ArrayList(a,b){
	arra = new Array(b);
	for (i = 0;i < arra.length;i++){
		arra[i] = Vectore(0,0);
	}
	return arra;
}

function preload(){
	if (load){
	w0csv = loadTable("csvFiles/v3/weights[0].csv","csv");
	w1csv = loadTable("csvFiles/v3/weights[1].csv","csv");
	w2csv = loadTable("csvFiles/v3/weights[2].csv","csv");
	}
}

function setup() {
	start();
	createCanvas(980, 580);
	frameRate(fR);
}

function draw() {




	// Drawing stuff goes in here:
	background(188,80,144);
	//background(230);
	for (i = 0; i < 29; i++){
		for (j = 0; j < 29; j++){
			//fill(88,80,141);
			fill(20);
			strokeWeight(1);
			//stroke(0,63,92);
			stroke(50);
			rect(i*sizeP,j*sizeP,sizeP,sizeP);
		}
	}
	strokeWeight(1);
	stroke(0);
	line(580,0,580,580);
	if (load){
		if (melhorCobra.dead){
			score = melhorCobra.score;
			start();
		} else {
			Snake.olhar(melhorCobra);
			Snake.think(melhorCobra);
			Snake.move(melhorCobra);
			Snake.show(melhorCobra);
			NeuralNetwork.show(586,0,200,580,melhorCobra.brain);
		}
	} else {
		if (popu.done){
			if (popu.gen/100>fileIt){

			}
			highscore = popu.bestSnake.score;
			if (highscore >  bestscore){
				bestscore = highscore;
			}
			Population.calcFit(popu);
			Population.selNatural(popu);
			Population.done(popu);
			console.log("Generation:",str(popu.gen) + ". Highscore:", str(bestscore) + ". Last best score:",str(highscore));
		} else{
			Population.upp(popu);
			Population.show(popu);
			Population.done(popu);
		}
	}
}
