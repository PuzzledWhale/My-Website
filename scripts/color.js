const canvas = document.getElementById('colorCanvas');
const canvasGuard = document.getElementById('guardCanvas');

const ctx = canvas.getContext('2d');
const ctxG = canvasGuard.getContext('2d');

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let width = canvas.width;
let height = canvas.height;
let centerY = height / 2;

class CompoundWave {
    constructor(waves, color, thickness) {
        this.parts = []
        for (let i = 0; i < waves.length; i++) {
            this.parts.push(new SineWave(waves[0]))
        }
        this.color = color;
        this.thickness = thickness;
    }

    update()  {
        for(let i = 0; i < this.parts.length; i++) {
            this.parts[i].update();
        }
    }

    calculateAt(x) {
        result = 0
        for (let i = 0; i < this.parts.length; i++) {
            result += this.parts[i].getY(x);
        }
        return result;
    }
}

class SineWave {
    constructor(amp, freq, shiftSpeed, ampSpeed, thickness, offset, color1, color2, layer) {
        this.maxAmp = amp;
        this.amp = amp;
        this.shift = Math.random() - 0.5;
        this.freq = freq;
        this.shiftSpeed = shiftSpeed;
        this.ampSpeed = ampSpeed;
        this.thickness = thickness;
        this.offset = offset;
        this.color1 = color1;
        this.color2 = color2;
        this.layer = layer;
        this.bterm = amp;
    }

    update() {
        this.amp += this.ampSpeed;
        this.shift += this.shiftSpeed;
        // this.offset += this.ampSpeed;
        if(Math.abs(this.amp) > this.maxAmp) {
            this.ampSpeed *= -1;
        }
    }

    getColor() {
        if(this.color1 == this.color2) {
            return this.color1;
        } else {
            const gradient = (this.layer == 0? ctx : ctxG).createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, color1); // Start color
            gradient.addColorStop(1, color2); // End color
            return gradient;
        }
    }
    
    calculateAt(x) {
        return this.amp * Math.cos(x * this.freq + this.shift) + this.offset;
        // return this.amp * Math.sin(x * this.freq + this.shift) + this.offset + (x / 9) - height * 0.2;
    }
}

class Line {
    constructor(slope, intercept, slopeSpeed, interceptSpeed, thickness, color1, color2, layer) {
        this.slope = slope;
        this.maxSlope - slope;
        this.intercept = intercept;
        this.interceptSpeed = interceptSpeed;
        this.slopeSpeed = slopeSpeed;
        this.thickness = thickness;
        this.color1 = color2;

    }
}

function createGradient(color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, color1); // Start color
    gradient.addColorStop(1, color2); // End color
    return gradient;
}


// Function to resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    canvas.height = window.innerHeight * 0.55;

    canvasGuard.width = window.innerWidth;
    // canvasGuard.height = window.innerHeight;
    canvasGuard.height = window.innerHeight * 0.55;
    
    // ctx.drawSineWave(new SineWave(0,0,0,0,200,0,'#DC4594','#4441DF',1));
}


// amplitude, frequency, phase shift, amplitude change speed, translation speed, max amplitude
// let waves = Array[[20, 0.0035,0,0.5,0.02,150],[24,0.003,1.231,-0.3,0.04,100],[10,0.01,-1,0.001, 0.01,50]];

// amp, freq, shiftSpeed, ampSpeed, thickness, offset, color1, color2, layer
const waves = []

waves.push(new SineWave(50, 0.001, 0.01, 0.1, 45, 0, '#DC4594', '#E54646', 0)); // pink orange thicc
waves.push(new SineWave(50, 0.004, -0.03, 0.9, 13, -50, '#F0A742', '#900137',0)); // yellow red thin
waves.push(new SineWave(50, 0.002, -0.04, 0.3, 37, -80, '#D9428F', '#4441DF',0)); // pink blue mid
waves.push(new SineWave(30, 0.002, -0.07, 0.6, 16, 95, '#900137', '#F0A742',0)); // red yellow thin
waves.push(new SineWave(60, 0.003, 0.04, -0.3, 80, 70, '#4441DF', '#D9428F', 0)); // blue pink thicc

// waves.push(new SineWave(34, 0.0051, 0.02, 0, 140, -190, '#FCFCFD', '#FCFCFD', 1)); // white guard
// waves.push(new SineWave(30, 0.0046, 0.04, 0, 100, 163, '#FCFCFD', '#FCFCFD', 1)); // white guard

waves.push(new SineWave(34, 0.0051, 0.02, 0, 150, -200, '#161616', '#161616', 1)); // dark guard
waves.push(new SineWave(30, 0.0046, 0.04, 0, 150, 200, '#161616', '#161616', 1)); // dark guard
// waves.push(new SineWave(20, 0.002, 0, 0, 50, 0, '#161616', '#161616', 1));

function drawSineWave(sinWave) {
    curr = sinWave.layer == 0? ctx : ctxG;
    curr.beginPath();
    curr.moveTo(0, centerY);

    for (let x = 1; x < width; x++) {
        const y = centerY + sinWave.calculateAt(x);
        curr.lineTo(x, y);
    }

    curr.lineWidth = sinWave.thickness;
    curr.strokeStyle = sinWave.color;
    curr.strokeStyle = createGradient(sinWave.color1, sinWave.color2);
    curr.stroke();
}

function animate() {
    width = canvas.width;
    height = canvas.height;
    centerY = height / 2;

    // wave updates
    for(let i = 0; i < waves.length; i++) {
        waves[i].update();
    }   

    // Clear the canvas
    // ctx.clearRect(0, 0, width, height);
    ctxG.clearRect(0, 0, width, height);

    // draw each wave
    for(let i = 0; i < waves.length; i++) {
        drawSineWave(waves[i]);
    }

    // Request the next frame
    requestAnimationFrame(animate);
    drawBorder(35);
    drawBorder(width - 35);


}

function drawBorder(x) {
    ctxG.beginPath();
    ctxG.moveTo(x, 0);
    ctxG.lineTo(x, height);
    ctxG.lineWidth = 80;
    ctxG.strokeStyle = '#161616';
    ctxG.stroke();
}
// Start the animation

animate();
