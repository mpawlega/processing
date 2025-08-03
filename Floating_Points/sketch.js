let osc;
let grid = [];
let gridSize =50;
let t = 0; // time variable 
let noiseScale = 0.02; // noise

function setup() {
  createCanvas(1500, 1800);
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
  frameRate(60);

  // Grid of points
  for (let x = gridSize / 2; x < width; x += gridSize) {
    for (let y = gridSize / 2; y < height; y += gridSize) {
      let dot = new Dot(x, y, gridSize);
      grid.push(dot);
    }
  }
}

function draw() {
  background(0);
  
 

  // Update and display each dot
  for (let dot of grid) {
    dot.update();
    dot.display();
  }
}

class Dot {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.phaseOffsetX = random(1000); // rand phase offset in x
    this.phaseOffsetY = random(2000); // rand phase offset in y
    this.noiseScale = 0.02; // noise
    this.oscFreq = map(this.x, 0, width, 100, 1000); // x-coor frequency
    this.oscAmp = map(this.y, 0, height, 0.1, 0.5); // y-coor amplitude
    this.colors = [
      color(255, 0, 255),   // Magenta
      color(50, 205, 50),   // Lime Green
      color(255, 0, 0)      // Red
    ];
    this.colorIndex = floor(random(this.colors.length)); // Randomly choose colour
  }

  update() {
    // Oscillate position via noise
    let noiseX = noise(this.x * this.noiseScale + this.phaseOffsetX, t);
    let noiseY = noise(this.y * this.noiseScale + this.phaseOffsetY, t);
    this.x += map(noiseX, 0, 3, -1, 1);
    this.y += map(noiseY, 0, 3, -1, 1);

    // Update oscillator parameters by position
    this.oscFreq = map(this.x, 0, width, 4000, 1000);
    this.oscAmp = map(this.y, 0, height, 10, 2);

    // Play sound by position
    this.playSound();
  }

  display() {
    noStroke();
    fill(this.colors[this.colorIndex]);
    ellipse(this.x, this.y, this.size, this.size);
  }

  playSound() {
    osc.freq(this.oscFreq);
    osc.amp(this.oscAmp, 0.5);
  }
}



