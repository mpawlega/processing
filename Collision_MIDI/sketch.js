let particles = [];
let numParticles = 50;
let notes = [60, 62, 64, 65, 67, 69, 71, 72];  // MIDI notes in C major scale
let osc, env;
let collisionCooldown = false;
let gradientColor1, gradientColor2;

function setup() {
  createCanvas(600, 800);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  osc = new p5.Oscillator('sine');
  env = new p5.Env();
  env.setADSR(0.01, 0.2, 0.1, 0.5);
  env.setRange(0.5, 0);
  osc.amp(env);
  osc.start();

  gradientColor1 = color(0, 0, 255);
  gradientColor2 = color(0, 255, 0);
}

function draw() {
  setGradient(0, 0, width, height, gradientColor1, gradientColor2);
  for (let i = 0; i < particles.length; i++) {
    particles[i].move();
    particles[i].display();
    for (let j = i + 1; j < particles.length; j++) {
      if (particles[i].checkCollision(particles[j])) {
        handleCollision(particles[i], particles[j]);
        if (!collisionCooldown) {
          playSound();
        }
      }
    }
  }
}

function handleCollision(p1, p2) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  let distance = dist(p1.x, p1.y, p2.x, p2.y);

  if (distance < p1.diameter / 2 + p2.diameter / 2) {
    // Normalize vector
    let angle = atan2(dy, dx);
    let targetX = p2.x + cos(angle) * (p1.diameter / 2 + p2.diameter / 2);
    let targetY = p2.y + sin(angle) * (p1.diameter / 2 + p2.diameter / 2);
    let ax = (targetX - p1.x) * 0.05;
    let ay = (targetY - p1.y) * 0.05;

    // Forces for particle bounce
    p1.speedX -= ax;
    p1.speedY -= ay;
    p2.speedX += ax;
    p2.speedY += ay;
  }
}

function playSound() {
  collisionCooldown = true;
  let midiValue = random(notes);
  let freqValue = midiToFreq(midiValue);
  osc.freq(freqValue);
  env.play();
  
  // Gradient colours update when sounds plays
  gradientColor1 = color(0, 205, random(255));
  gradientColor2 = color(random(255), 0, 16);

  // Delay between collision sounds
  setTimeout(() => {
    collisionCooldown = false;
  }, 200); 
}

function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function setGradient(x, y, w, h, c1, c2) {
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.diameter = 10;
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < this.diameter / 2 || this.x > width - this.diameter / 2) {
      this.speedX *= -1;
    }

    if (this.y < this.diameter / 2 || this.y > height - this.diameter / 2) {
      this.speedY *= -1;
    }
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  checkCollision(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    if (d < this.diameter / 2 + other.diameter / 2) {
      return true;
    }
    return false;
  }
}


