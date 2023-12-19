let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;
let fontSize = Math.round(canvas.width/30);
console.log(fontSize);
ctx.font = `${fontSize}px Arial`;
ctx.fillStyle = "#FFD700";

let lines = [];
let mouse = {
    x: 1000,
    y: canvas.height / 2
};
let isLeft = false;
let isKeyDownA = false;
let isKeyDownD = false;
let isRight = false;
let syncP = 0;
let numGreenLines = 0;
let color = '#0f0';
let animationPaused = true;
let numDrawnLines = 0;
let timeNow = performance.now()
let timeAfter = 0;
let fps = 0;
let counterLines = 0;
let space = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
let counter = document.createElement('div');

counter.id = 'counter';
counter.style.fontSize = `${fontSize}px`;
counter.style.fontFamily = 'Arial'
counter.style.color = '#ffcb00';
document.body.appendChild(counter);

document.addEventListener('mousemove', function(e) {
    if (e.clientX < mouse.x) {
        isLeft = true;
        isRight = false;
    } else if (e.clientX > mouse.x) {
        isRight = true;
        isLeft = false;
    } else  if (e.clientX === mouse.x){
        isRight = false;
        isLeft = false;
    }
    mouse.x = e.clientX;
});

document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'a' ){
        isKeyDownA = true;
    }
    else if (e.key.toLowerCase() === 'd') {
        isKeyDownD = true;
    }
    else if (e.code === 'Space') {
        animationPaused = !animationPaused;

        ctx.fillText("Press spacebar to restart",  canvas.width/3.2 , canvas.height/2);
        if (!animationPaused) {
            lines = [];
            fps = 0;
            counterLines = 0;
            numGreenLines = 0;
            numDrawnLines = 0;
            animate();
        }
    }
});

document.addEventListener('keyup', function(e) {
    if ( e.key.toLowerCase() === 'd') {
        isKeyDownD = false;
    }
    if (e.key.toLowerCase() === 'a') {
        isKeyDownA = false;
    }
});

ctx.fillText("Press spacebar to start", canvas.width/3.2, canvas.height/2);

function animate() {

    if (animationPaused) {
        return;
    }

    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 40;

    if (((isKeyDownA && isLeft) || (isKeyDownD && isRight)) && !(isKeyDownA && isKeyDownD)) {
        color = '#0f0';
    } else {
        color = '#000';
    }

    syncP = (numGreenLines/lines.length)*100;
    timeAfter = performance.now()
    if ((timeAfter - timeNow) >= 500){
        fps = counterLines/0.5;
        timeNow = timeAfter;
        counterLines = 0;
    }

    counter.innerHTML =
        "Drawn:&nbsp" + numDrawnLines + space +
        "Shown:&nbsp" + lines.length + space +
        "Sync%:&nbsp" + Math.round(syncP) + space +
        "FPS:&nbsp" + fps + space;

    //
    // new line
    let newLine = {
        x: canvas.width/1.6 - mouse.x/4,
        y: canvas.height/8,
        color: color
    };

    if (newLine.color === '#0f0') {
        numGreenLines++;
    }

    let size = lines.unshift(newLine);

    numDrawnLines++;
    counterLines++;

    for (let i = 0; i < size; i++) {
        let line = lines[i];
        line.y += 1.5;

        if (i > 0) {
            let prevLine = lines[i - 1];
            ctx.beginPath();
            ctx.lineTo(line.x, line.y);
            ctx.lineTo(prevLine.x, prevLine.y);
            ctx.lineCap = 'round';
            ctx.strokeStyle = line.color;
            ctx.stroke();
        }
    }

    if (size > 900) {
        if (lines.pop().color === '#0f0') {
            numGreenLines--;
        }
    }
}

