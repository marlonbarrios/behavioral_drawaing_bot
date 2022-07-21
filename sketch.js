let group = [];  // our particle system 
  
let settings = {
  damping: 1,
  stroke_alpha: 30, // foreground
  strokeRedP: 255,
  strokeGreenP : 0,
  strokeBlueP: 0,
  strokeRedL: 0,
  strokeGreenL : 0,
  strokeBlueL: 0,
  particleSize: 0,
  Red_bg: 255,
  Green_bg: 255,
  Blue_bg: 255,
  bg_alpha: 254, // background
  particles: true,
  lines: true,
  linesWeight: 1,
  gravity: 0,
  lifespan: 400,
}
  
let gui; 
var svg;

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth - 300, windowHeight);
  rectMode(CENTER); 



function setup() {
  var myCanvas = createCanvas(1200, 1200, SVG);
  myCanvas.parent("#myContainer");

  svg = createSVG();
  svg.beginRecord();
}
  
  
  gui = new dat.GUI();
  gui.add(settings, 'particles', true, false).name("Particles");
  gui.add(settings, 'particleSize', 0, 100).name("Particle Size");
  gui.add(settings, 'lines', true, false).name("Lines");
  gui.add(settings, 'linesWeight', 1, 10).name("Line Weight");
  gui.add(settings, 'damping', 0.95, 1).name("Friction");
  gui.add(settings, 'Red_bg', 0, 255).name("Red Background");
  gui.add(settings, 'Green_bg', 0, 255).name("Green Background");
  gui.add(settings, 'Blue_bg', 0, 255).name("Blue Background");
  gui.add(settings, 'bg_alpha', 0, 254).name("Alpha Background");
  gui.add(settings, 'strokeRedP', 0, 255).name("Red Particles");
  gui.add(settings, 'strokeGreenP', 0, 255).name("Green Particles");
  gui.add(settings, 'strokeBlueP', 0, 255).name("Blue Particles");
  gui.add(settings, 'strokeRedL', 0, 255).name("Red Lines");
  gui.add(settings, 'strokeGreenL', 0, 255).name("Green Lines");
  gui.add(settings, 'strokeBlueL', 0, 255).name("Blue Lines");
  gui.add(settings, 'stroke_alpha', 0, 255).name("Alpha Drawing");
  gui.add(settings, 'gravity', -0.1, 0.1).name("Gravity");
  gui.add(settings, 'lifespan', 2, 1000).name("Lifespan");

  gui.remember(settings);
  gui.width = 300;
  gui.close();
  
  background(settings.Red_bg, settings.Green_bg, settings.Blue_bg, settings.bg_alpha);

}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth-300, windowHeight);
  
  background(settings.Red_bg, settings.Green_bg, settings.Blue_bg, settings.bg_alpha);
  noFill();     
}

function createAgent(x=0, y=0, vx=0, vy=0) {
  let temp = {
    position: new p5.Vector(x, y),
    velocity: new p5.Vector(vx, vy),
    acceleration: new p5.Vector(),
    lifespan: settings.lifespan,
  }
  return temp; 
}s

function keyPressed() { 

  if (key == 's') {
    save("drawing.jpg");
  
  }
}


// Main render loop 
function draw() {
  // Fill in the background
   
  background(settings.Red_bg, settings.Green_bg, settings.Blue_bg, settings.bg_alpha);
  noFill();     
  
  if(settings.particles == true) {
  let gravity = new p5.Vector(0, settings.gravity);
  
  // create new agents over time 
  if (mouseIsPressed) { 
    let newGuy = createAgent(mouseX, mouseY, 
                            random(-1, 1), random(-1, 1)); 
    group.push(newGuy);
  }
  
  // iterate of the group array and update/render all the agents
  for (let agent of group) {  
    move(agent); // do this first
    twitch(agent);
    applyForce(agent, gravity);
    render(agent);
  }

  }
  if(settings.lines==true) {
  // draw lines connecting the agents 
  stroke(settings.strokeRedL, settings.strokeGreenL, settings.strokeBlueL, settings.stroke_alpha);
  for (let i=0; i < group.length; i++) {
     for (let j=i; j < group.length; j++) {
       if (i != j) {
          let x1 = group[i].position.x;
          let y1 = group[i].position.y; 
          let x2 = group[j].position.x; 
          let y2 = group[j].position.y; 
          let d = dist(x1, y1, x2, y2);
          if (d > 25 && d < 50) {
            strokeWeight(settings.linesWeight);
            line(x1, y1, x2, y2);
          }
       }
       
     } 
  }
}
  
  // get rid of dead weight
  cleanUp(group);
   
  // display the number of active agents
  // fill(255); 
  // noStroke(); 
}

function render(agent) { 
  push();
  translate(agent.position.x, agent.position.y);
  rotate(agent.velocity.heading());
  //let alpha = map(agent.lifespan, 0, 300, 0, 255);
  stroke(settings.strokeRedP, settings.strokeGreenP, settings.strokeBlueP, settings.stroke_alpha);
  ellipse(0, 0, settings.particleSize);  
  pop();
}

function move(agent) { 
  agent.velocity.add(agent.acceleration);
  agent.velocity.mult(settings.damping);
  agent.position.add(agent.velocity); 
  agent.acceleration.mult(0); // zero the acceleration 
  agent.lifespan--;
}

function applyForce(agent, force) {
  agent.acceleration.add(force);
}

function twitch(agent) {  
  agent.velocity.rotate(random(-0.02, 0.02));
}

function cleanUp(group) { 
  for (let i=group.length-1; i >= 0; i--) {
    let agent = group[i];
    // || --> OR 
    if (isAgentInsideBox(agent, -50, -50, width+100, height+100) == false
        || agent.lifespan <= 0) { 
      // get rid of this agent 
      group.splice(i, 1); // remove 1 object starting at index i
    }
  }
}

function isAgentInsideBox(agent, x, y, w, h) {
  let ax = agent.position.x; 
  let ay = agent.position.y;
  // && --> AND 
  if (ax > x && ax < x+w && ay > y && ay < y+h) return true;
  else return false;
}