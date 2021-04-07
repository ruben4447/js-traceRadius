var canvas;
var shape, shapeRot = 0;
var point, angle = 0, angleInc = 1;
var appMode;
var shapeCentre;
var graphYValues = [], graphOrigin, xAxisLength, xInc = 0.5;
const shape_radius = 100;

const input_sides = document.getElementById('input-sides');
const input_length = document.getElementById('input-length');
const input_debug = document.getElementById(`input-debug`);
const input_shapeRot = document.getElementById('input-shape-rot');
const input_ΔshapeRot = document.getElementById('input-shape-rot-delta');
const input_pointRot = document.getElementById('input-point-rot');
const input_ΔpointRot = document.getElementById('input-point-rot-delta');
const input_radius = document.getElementById('input-radius');
const input_appMode = document.getElementById('input-app-mode');

const APP_MODES = Object.freeze({ rotate: 0, follow: 1, graph: 2, colours: 3 });

function changeAppMode(mode) {
    appMode = +mode;
    if (appMode === APP_MODES.graph) shapeCentre = [shape_radius * 1.3, height/2];
    else shapeCentre = [width/2, height/2];

    shape.centre(...shapeCentre);
    if (mode === APP_MODES.graph) configSetRadius(shape_radius);
    if (mode === APP_MODES.follow) shape.startingAngle = 0;
    graphYValues.length = 0;
}

function configSetRadius(radius) {
    shape.setRadius(radius);
    input_radius.value = radius;
    input_length.value = shape.sideLength;
}

function configSetLength(length) {
    shape.sideLength = length;
    input_length.value = length;
    input_radius.value = shape.getRadius();
}

function configSetNSides(n) {
    shape.nSides = n
    input_sides.value = n;
    if (appMode === APP_MODES.graph) configSetRadius(shape_radius);
}

function configSetPointRot(deg, sudoSet = false) {
    console.log(input_pointRot.value, deg)
    if (sudoSet || input_pointRot.value != deg) input_pointRot.value = deg;
    angle = deg;
}

function configSetShapeRot(deg, updateShape, sudoSet = false) {
    const rad = degToRad(deg);
    if (sudoSet || input_shapeRot.value != rad) input_shapeRot.value = rad;
    if (updateShape) shape.startingAngle = rad;
}

function setup() {
    canvas = createCanvas(800, 500);
    canvas.parent("#target");
    graphOrigin = [shape_radius * (2 * 1.3), height/2];
    xAxisLength = width - graphOrigin[0];
    
    input_sides.addEventListener('change', () => {
        configSetNSides(+input_sides.value);
    });

    input_length.addEventListener('change', () => {
        consigSetLength(+input_length.value);
    });

    input_radius.addEventListener('change', () => {
        configSetRadius(+input_radius.value);
    });

    input_pointRot.value = 0;
    input_pointRot.addEventListener('change', () => setPointRot(+input_pointRot.value));
    input_ΔpointRot.value = 1;
    input_ΔpointRot.addEventListener('change', () => angleInc = +input_ΔpointRot.value);

    input_shapeRot.value = 0;
    input_shapeRot.addEventListener('change', () => configSetShapeRot(+input_shapeRot.value));
    input_ΔshapeRot.value = 0;
    input_ΔshapeRot.addEventListener('change', () => configSetPointRot(+input_ΔshapeRot.value));

    input_appMode.addEventListener('change', () => changeAppMode(+input_appMode.value));
    
    shape = new Shape(50, 3);
    configSetNSides(3);
    configSetRadius(Math.round(width / 3));
    changeAppMode(APP_MODES.rotate);

    textAlign(CENTER, CENTER);
}

function draw() {
    if (appMode === APP_MODES.follow) followMouse();
    else if (appMode === APP_MODES.graph) drawGraph();
    else if (appMode === APP_MODES.colours) drawColoured();
    else rotateAroundPerim();
}

function rotateAroundPerim() {
    background(255);
    angle += angleInc;
    angle %= 360;
    configSetPointRot(angle);
        
    if (input_debug.checked) {
        // Draw triangle segments inside shape
        stroke(255, 10, 22);
        shape.drawTriangleSegments(true);
        
        // Draw segment heights (split each segment in two)
        stroke(255, 100, 220);
        shape.drawSegmentHeights();
    } else {
        // Draw shape outline
        stroke(51);
        noFill();
        shape.drawOutline();
    }

    // Get point on radius
    let theta = degToRad(angle);
    point = shape.pointOnRadius(theta);

    // Draw circle at point (line to point?)
    if (input_debug.checked) {
        stroke(0, 0, 255);
        line(shape.x, shape.y, ...point)
        noStroke();
        fill(255, 0, 255);
        circle(...point, 17);
    } else {
        noStroke();
        fill(51);
        circle(...point, 10);
    }

    if (input_debug.checked) {
        // Show segment point is in
        let n = theta / shape.getTheta();
        fill(255);
        text(Math.floor(n).toString(), ...point);

        // Show angle
        noFill();
        stroke(0, 30, 255);
        let r = 20;
        arc(shape.x, shape.y, r, r, shape.startingAngle, shape.startingAngle + theta, OPEN);

        // Draw shape centre
        fill(255, 100, 0);
        noStroke();
        circle(shape.x, shape.y, 10);
    }
}

function followMouse() {
    background(255);

    stroke(51);
    shape.drawOutline();

    // get angle of mouse from shape centre
    let angle = shape.getAngleFromCentre(mouseX, mouseY);
    configSetPointRot(angle);
    
    if (input_debug.checked) {
        stroke(0, 255, 0);
        let dx = shape.x - mouseX;
        line(mouseX, mouseY, mouseX + dx, mouseY);
        let dy = shape.y - mouseY;
        line(mouseX + dx, mouseY, mouseX + dx, mouseY + dy);
        
        stroke(255, 0, 0);
        line(mouseX, mouseY, mouseX + dx, mouseY + dy);
    }
    
    point = shape.pointOnRadius(angle);
    
    if (input_debug.checked) {
        // Line from center to point
        stroke(51);
        line(shape.x, shape.y, ...point);

        // Draw circle at point
        noStroke();
        fill(255, 0, 255);
        circle(...point, 18);

        // Dir we are in
        let dir = shape.getDirIn(mouseX, mouseY);
        fill(255);
        text(dir, ...point);

        // Show angle
        noFill();
        stroke(0, 30, 255);
        let r = 20;
        arc(shape.x, shape.y, r, r, shape.startingAngle, shape.startingAngle + angle, OPEN);
    } else {
        // Draw circle at point
        noStroke();
        fill(51);
        circle(...point, 10);
    }
}

function drawGraph() {
    background(255);
    shape.startingAngle += shapeRot;
    shape.startingAngle %= TWO_PI;
    consigSetShapeRot(radToDeg(shape.startingAngle), false);

    angle += angleInc;
    angle %= 360;
    configSetPointRot(angle);
    
    // Draw shape outline
    stroke(51);
    noFill();
    shape.drawOutline();

    // Get point on radius
    let theta = degToRad(angle);
    point = shape.pointOnRadius(theta);
    graphYValues.push(point[1]);
    while (graphYValues.length > xAxisLength / xInc) graphYValues.shift();
    
    // Draw line to point
    input_debug.checked ? stroke(0, 0, 255) : stroke(51);
    line(shape.x, shape.y, ...point)

    // Graph Origin
    fill(51);
    stroke(51);
    circle(...graphOrigin, 4);

    // Y axis
    let maxdy = shape.getRadius() + 10;
    line(graphOrigin[0], graphOrigin[1] - maxdy, graphOrigin[0], graphOrigin[1] + maxdy);
    
    // X axis
    line(graphOrigin[0], graphOrigin[1], graphOrigin[0] + xAxisLength, graphOrigin[1]);

    // Plot graph points
    noFill();
    stroke(0, 255, 0);
    beginShape();
    let x = graphOrigin[0];
    for (let yval of graphYValues) {
        vertex(x, yval);
        x += xInc;
    }
    endShape();

    if (input_debug.checked) {
        // Line from point to last plotted point
        stroke(255, 180, 0);
        line(...point, x, graphYValues[graphYValues.length - 1]);

        fill(255, 0, 0);
        noStroke();
        circle(x, graphYValues[graphYValues.length - 1], 8);
    }

    if (input_debug.checked) {
        // Show point
        noStroke();
        fill(255, 0, 255);
        circle(...point, 17);

        // Show angle
        noFill();
        stroke(0, 30, 255);
        let r = 20;
        arc(shape.x, shape.y, r, r, shape.startingAngle, shape.startingAngle + theta, OPEN);

        // Draw shape centre
        fill(255, 100, 0);
        noStroke();
        circle(shape.x, shape.y, 10);
    }
}

function drawColoured() {
    background(51, 25);
    
    angle += angleInc;
    angle %= 360;
    input_pointRot.value = angle;
    
    stroke(255);
    shape.drawOutline();
    
    let α = degToRad(angle);
    
    const DEBUG = input_debug.checked;
    
    colorMode(HSB);
    let div = 360 / shape.nSides;
    let θ = shape.getTheta();
    for (let i = 0; i < shape.nSides; i++) {
        noStroke();
        fill(i * div, 255, 255);
        let point = shape.pointOnRadius((i * θ) + α);
        circle(...point, 10);
        
        if (DEBUG) {
            stroke(i * div, 100, 100);
            line(...point, shape.x, shape.y);
        }
    }
    colorMode(RGB);
}