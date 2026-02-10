let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;
let fontSize = Math.round(canvas.width / 30);

const maxSize = 2000;
let lines = new Array(maxSize).fill(null);
let head = 0;
let isBufferFull = false;

let mouse = { x: 1000, y: canvas.height / 2 };
let isLeft = false, isRight = false;
let isKeyDownA = false, isKeyDownD = false;
let syncP = 0;
let numGreenLines = 0;
let animationPaused = true;
let numDrawnLines = 0;
let lastTime = performance.now();
let accumulator = 0;
const tickRate = 1000 / 480;
const scrollSpeed = 1.5;

let space = "&nbsp&nbsp&nbsp&nbsp";
let counter = document.createElement('div');
counter.id = 'counter';
counter.style.fontSize = `${fontSize}px`;
counter.style.fontFamily = 'Arial';
counter.style.color = '#ffcb00';
document.body.appendChild(counter);

document.addEventListener('mousemove', (e) => {
    if (e.clientX < mouse.x) { isLeft = true; isRight = false; }
    else if (e.clientX > mouse.x) { isRight = true; isLeft = false; }
    mouse.x = e.clientX;
});

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'a') isKeyDownA = true;
    if (e.key.toLowerCase() === 'd') isKeyDownD = true;
    if (e.code === 'Space') {
        animationPaused = !animationPaused;
        if (!animationPaused) {
            lines.fill(null);
            head = 0;
            isBufferFull = false;
            numGreenLines = 0;
            numDrawnLines = 0;
            accumulator = 0;
            lastTime = performance.now();
            animate(performance.now());
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'a') isKeyDownA = false;
    if (e.key.toLowerCase() === 'd') isKeyDownD = false;
});

ctx.fillStyle = "#FFD700";
ctx.font = `${fontSize}px Arial`;
ctx.fillText("Press spacebar to start", canvas.width / 3.2, canvas.height / 2);

function animate(currentTime) {
    if (animationPaused) return;
    requestAnimationFrame(animate);

    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    accumulator += deltaTime;

    while (accumulator >= tickRate) {
        updateLogic();
        accumulator -= tickRate;
    }

    draw();
}

function updateLogic() {
    let color = '#333';
    if (((isKeyDownA && isLeft) || (isKeyDownD && isRight)) && !(isKeyDownA && isKeyDownD)) {
        color = '#0f0';
    }

    if (lines[head] && lines[head].color === '#0f0') numGreenLines--;
    
    lines[head] = {
        x: canvas.width / 2.5 + mouse.x / 4,
        color: color
    };

    if (color === '#0f0') numGreenLines++;
    head = (head + 1) % maxSize;
    if (head === 0) isBufferFull = true;
    numDrawnLines++;

    let currentCount = isBufferFull ? maxSize : head;
    syncP = currentCount > 0 ? (numGreenLines / currentCount) * 100 : 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let currentCount = isBufferFull ? maxSize : head;
    let startIndex = isBufferFull ? head : 0;

    for (let i = 1; i < currentCount; i++) {
        let prevIndex = (startIndex + i - 1) % maxSize;
        let currentIndex = (startIndex + i) % maxSize;
        
        let prevLine = lines[prevIndex];
        let line = lines[currentIndex];
        if (!prevLine || !line) continue;

        let yPos = (canvas.height / 8) + ((currentCount - i) * scrollSpeed);
        let prevYPos = (canvas.height / 8) + ((currentCount - (i - 1)) * scrollSpeed);

        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.moveTo(prevLine.x, prevYPos);
        ctx.lineTo(line.x, yPos);
        ctx.stroke();
    }

    counter.innerHTML = `Sync: ${Math.round(syncP)}% ${space} Total Lines: ${numDrawnLines}`;
}