const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the sprite sheet
const spriteSheet = new Image();
spriteSheet.src = './sprite_sheet.png'; // Ensure this path is correct

const spriteWidth = 5376 / 42; // Width of a single frame (5376 / 42)
const spriteHeight = 1024 / 8; // Height of a single frame (1024 / 8)
const idleFrameCount = 4; // Number of frames for idle animation
const runningFrameCount = 10; // Number of frames for running animation
const frameSpeed = 1000/24; // Speed of animation
const runningSpeed = 20; // Speed of the rat's running

let currentFrame = 0;
let direction = 0; // 0: down, 1: down-left, 2: left, 3: up-left, 4: up, 5: up-right, 6: right, 7: down-right
let x = canvas.width / 2;
let y = canvas.height / 2;

let keys = {};
let isRunning = false;

function update() {
    if (isRunning) {
        currentFrame = (currentFrame + 1) % runningFrameCount + 4; // Running frames are in columns 4-13
    } else {
        currentFrame = (currentFrame + 1) % idleFrameCount; // Idle frames are in columns 1-4
    }

    if (keys['ArrowDown'] && keys['ArrowLeft']) {
        direction = 7;
        y += runningSpeed/1.41;
        x -= runningSpeed/1.41;
    } else if (keys['ArrowDown'] && keys['ArrowRight']) {
        direction = 5;
        y += runningSpeed/1.41;
        x += runningSpeed/1.41;
    } else if (keys['ArrowUp'] && keys['ArrowLeft']) {
        direction = 1;
        y -= runningSpeed/1.41;
        x -= runningSpeed/1.41;
    } else if (keys['ArrowUp'] && keys['ArrowRight']) {
        direction = 3;
        y -= runningSpeed/1.41;
        x += runningSpeed/1.41;
    } else if (keys['ArrowDown']) {
        direction = 6;
        y += runningSpeed;
    } else if (keys['ArrowUp']) {
        direction = 2;
        y -= runningSpeed;
    } else if (keys['ArrowLeft']) {
        direction = 0;
        x -= runningSpeed;
    } else if (keys['ArrowRight']) {
        direction = 4;
        x += runningSpeed;
    }

    // Keep the character within the canvas boundaries
    x = Math.max(0, Math.min(canvas.width - spriteWidth, x));
    y = Math.max(0, Math.min(canvas.height - spriteHeight, y));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(spriteSheet, currentFrame * spriteWidth, direction * spriteHeight, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
}

function loop() {
    update();
    draw();
    setTimeout(loop, frameSpeed);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    isRunning = true;
    // Handle diagonal keys combination
    if (e.key === 'ArrowDown' && keys['ArrowLeft']) {
        keys['ArrowDownLeft'] = true;
    }
    if (e.key === 'ArrowDown' && keys['ArrowRight']) {
        keys['ArrowDownRight'] = true;
    }
    if (e.key === 'ArrowUp' && keys['ArrowLeft']) {
        keys['ArrowUpLeft'] = true;
    }
    if (e.key === 'ArrowUp' && keys['ArrowRight']) {
        keys['ArrowUpRight'] = true;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    isRunning = Object.values(keys).some(Boolean); // Check if any keys are still pressed
    // Reset diagonal keys combination
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        keys['ArrowDownLeft'] = false;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        keys['ArrowDownRight'] = false;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        keys['ArrowUpLeft'] = false;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        keys['ArrowUpRight'] = false;
    }
});

spriteSheet.onload = function() {
    loop();
};

// Update canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
