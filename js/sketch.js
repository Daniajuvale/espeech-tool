let mic, fft;
// var canvasDiv = document.getElementById("sketch-div");
// var wid = canvasDiv.offsetWidth;
// var ht = canvasDiv.offsetHeight;
function setup() {
  var canvas = createCanvas(900, 300);
  
  canvas.parent('sketch-div');
  noFill();
  mic = new p5.AudioIn();
  mic.start();
  getAudioContext().resume();
  fft = new p5.FFT(0.9,1024);
  fft.setInput(mic);
}

function draw() {
  background(255);
  strokeWeight(20);
  stroke(0,255,0)
  line(110, 0, 110, height);
  strokeWeight(20);
  stroke(0,255,0)
  line(225, 0, 225, height);
  let spectrum = fft.analyze();
  strokeWeight(1)
  stroke(0,0,0)
  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i*10, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
}
