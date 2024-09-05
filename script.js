// script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const backgroundImg = new Image();
const birdImg = new Image();
const topPipeImg = new Image();
const bottomPipeImg = new Image();
const heartImg = new Image();

backgroundImg.src = 'images/backg.jpg';
birdImg.src = 'images/flappy-bird-removebg-preview.png';
topPipeImg.src = 'images/flappy-bird-pipe-png-3-removebg-preview1.png';
bottomPipeImg.src = 'images/flappy-bird-pipe-png-3-removebg-preview.png';
heartImg.src = 'images/heart.png'; 

// Game settings
const birdSize = 40;
const birdGravity = 0.6;
const birdLift = -12;
const pipeWidth = 60;
const pipeGap = 200;
const pipeSpeed = 3;
const initialLives = 3;

// Game state
let birdY = canvas.height / 2 - birdSize / 2;
let birdVelocity = 0;
let pipes = [];
let score = 0;
let lives = initialLives;
let gameInterval;

// Initialize game
function initGame() {
    birdY = canvas.height / 2 - birdSize / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    lives = initialLives;
    document.getElementById('scoreBox').textContent = `Score: ${score}`;
    document.getElementById('livesBox').innerHTML = `Lives: ${'❤️'.repeat(lives)}`;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 20);
    document.addEventListener('keydown', handleKeydown);
    generatePipe();
}

// Update game state
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Update bird position
    birdVelocity += birdGravity;
    birdY += birdVelocity;

    // Check for canvas bounds collision
    if (birdY < 0 || birdY + birdSize > canvas.height) {
        gameOver();
        return;
    }

    // Draw bird
    ctx.drawImage(birdImg, 50, birdY, birdSize, birdSize);

    // Update and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;
        // Draw pipes
        ctx.drawImage(topPipeImg, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(bottomPipeImg, pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);

        // Check for collisions
        if (pipe.x < 50 + birdSize && pipe.x + pipeWidth > 50 &&
            (birdY < pipe.topHeight || birdY + birdSize > canvas.height - pipe.bottomHeight)) {
            loseLife();
        }

        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
            document.getElementById('scoreBox').textContent = `Score: ${score}`;
        }
    }

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        generatePipe();
    }
}

// Generate new pipes
function generatePipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 50) + 20;
    const bottomHeight = canvas.height - topHeight - pipeGap;
    pipes.push({ x: canvas.width, topHeight, bottomHeight });
}

// Handle key down events
function handleKeydown(e) {
    if (e.code === 'ArrowUp') {
        birdVelocity = birdLift;
    }
    if (e.code === 'ArrowDown') {
        birdVelocity = birdGravity;
    }
}

// Lose a life
function loseLife() {
    lives--;
    document.getElementById('livesBox').innerHTML = `Lives: ${'❤️'.repeat(lives)}`;
    if (lives <= 0) {
        gameOver();
    } else {
        // Reset bird position and velocity
        birdY = canvas.height / 2 - birdSize / 2;
        birdVelocity = 0;
        pipes = [];
        generatePipe();
    }
}

// End the game
function gameOver() {
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(birdImg, 50, birdY, birdSize, birdSize);

    // Show game over message and buttons
    const gameOverBox = document.createElement('div');
    gameOverBox.className = 'game-over-box';
    gameOverBox.innerHTML = `
        Game Over<br>
        Final Score: ${score}<br>
        <button onclick="restartGame()">Restart</button>
        <button onclick="newGame()">New Game</button>
    `;
    document.body.appendChild(gameOverBox);

    document.removeEventListener('keydown', handleKeydown);
}

// Restart the game
function restartGame() {
    document.querySelector('.game-over-box').remove();
    initGame();
}

// Start a new game
function newGame() {
    document.querySelector('.game-over-box').remove();
    document.getElementById('startBox').style.display = 'block';
}

// Start game
function startGame() {
    document.getElementById('startBox').style.display = 'none';
    initGame();
}

// Show start button when page loads
function showStartButton() {
    document.getElementById('startBox').style.display = 'block';
}

// Show start button when page loads
showStartButton();
