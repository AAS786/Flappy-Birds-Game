const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const backgroundImg = new Image();
const birdImg = new Image();
const topPipeImg = new Image();
const bottomPipeImg = new Image();
const heartImg = new Image();

backgroundImg.src = 'https://i.postimg.cc/V6zc0HCL/backg.jpg';
birdImg.src = 'https://i.postimg.cc/3Ns1dNSM/flappy-bird-removebg-preview.png';
topPipeImg.src = 'https://i.postimg.cc/5NCc2F7t/flappy-bird-pipe-png-3-removebg-preview1.png';
bottomPipeImg.src = 'https://i.postimg.cc/8cfRLG9h/flappy-bird-pipe-png-3-removebg-preview.png';
heartImg.src = 'https://i.postimg.cc/7LbTH4BJ/heart.png'; // Add heart image for lives

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
let bestScore = 0; // Track best score
let lives = initialLives;
let gameInterval;

// Initialize game
function initGame() {
    birdY = canvas.height / 2 - birdSize / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    lives = initialLives;
    updateScoreAndLives();
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
        loseLife();
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
            return;
        }

        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
            updateScoreAndLives();
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

// Handle keydown event
function handleKeydown(e) {
    if (e.code === 'Space') {
        birdVelocity = birdLift;
    }
}

// Lose a life
function loseLife() {
    lives--;
    if (lives <= 0) {
        gameOver();
    } else {
        updateScoreAndLives();
    }
}

// Update score and lives display
function updateScoreAndLives() {
    document.getElementById('scoreBox').textContent = `Score: ${score}`;
    document.getElementById('bestScoreBox').textContent = `Best Score: ${bestScore}`;
    document.getElementById('livesBox').innerHTML = `Lives: ${'❤️'.repeat(lives)}`;
}

// End game
function gameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    if (score > bestScore) {
        bestScore = score;
        document.getElementById('bestScoreBox').textContent = `Best Score: ${bestScore}`;
    }
    document.removeEventListener('keydown', handleKeydown);
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('scoreBox').style.display = 'none';
    document.getElementById('bestScoreBox').style.display = 'none';
    document.getElementById('livesBox').style.display = 'none';
    document.getElementById('startBox').style.display = 'block';
}

// Start game
function startGame() {
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('scoreBox').style.display = 'block';
    document.getElementById('bestScoreBox').style.display = 'block';
    document.getElementById('livesBox').style.display = 'block';
    document.getElementById('startBox').style.display = 'none';
    initGame();
}
