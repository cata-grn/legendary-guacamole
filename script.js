const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

let player = {
    x: 15,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    maxSpeed: 6
};

let computer = {
    x: canvas.width - 25,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    maxSpeed: 4.5,
    difficulty: 0.1
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    radius: ballSize,
    maxSpeed: 8
};

let scores = {
    player: 0,
    computer: 0
};

// Keyboard state
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Center paddle on mouse
    player.y = mouseY - player.height / 2;
    
    // Keep paddle in bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
});

// Arrow key controls
function updatePlayerInput() {
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.y -= player.maxSpeed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.y += player.maxSpeed;
    }
    
    // Keep player in bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Computer AI
function updateComputerAI() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    // AI looks ahead to predict ball position
    const distanceToComputer = computer.x - ball.x;
    const prediction = distanceToComputer / ball.dx * ball.dy;
    const predictedBallY = ball.y + prediction;
    
    // Difficulty determines how accurate AI is
    if (predictedBallY < computerCenter - 35) {
        computer.y -= computer.maxSpeed;
    } else if (predictedBallY > computerCenter + 35) {
        computer.y += computer.maxSpeed;
    }
    
    // Add slight imperfection based on difficulty
    if (Math.random() > (1 - computer.difficulty)) {
        computer.y += (Math.random() - 0.5) * 2;
    }
    
    // Keep computer in bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Collision detection
function checkCollision(ball, paddle) {
    return ball.x - ball.radius < paddle.x + paddle.width &&
           ball.x + ball.radius > paddle.x &&
           ball.y - ball.radius < paddle.y + paddle.height &&
           ball.y + ball.radius > paddle.y;
}

// Update game state
function update() {
    updatePlayerInput();
    updateComputerAI();
    
    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }
    
    // Ball collision with paddles
    if (checkCollision(ball, player)) {
        if (ball.dx < 0) {
            ball.dx = -ball.dx;
            ball.x = player.x + player.width + ball.radius;
            
            // Add spin based on where ball hits paddle
            const collidePoint = ball.y - (player.y + player.height / 2);
            collidePoint = collidePoint / (player.height / 2);
            ball.dy = collidePoint * ball.maxSpeed;
            
            // Increase ball speed slightly
            ball.dx *= 1.05;
            if (Math.abs(ball.dx) > ball.maxSpeed) {
                ball.dx = ball.dx > 0 ? ball.maxSpeed : -ball.maxSpeed;
            }
        }
    }
    
    if (checkCollision(ball, computer)) {
        if (ball.dx > 0) {
            ball.dx = -ball.dx;
            ball.x = computer.x - ball.radius;
            
            // Add spin based on where ball hits paddle
            const collidePoint = ball.y - (computer.y + computer.height / 2);
            collidePoint = collidePoint / (computer.height / 2);
            ball.dy = collidePoint * ball.maxSpeed;
            
            // Increase ball speed slightly
            ball.dx *= 1.05;
            if (Math.abs(ball.dx) > ball.maxSpeed) {
                ball.dx = ball.dx > 0 ? ball.maxSpeed : -ball.maxSpeed;
            }
        }
    }
    
    // Scoring
    if (ball.x - ball.radius < 0) {
        scores.computer++;
        resetBall();
    }
    
    if (ball.x + ball.radius > canvas.width) {
        scores.player++;
        resetBall();
    }
    
    // Update score display
    playerScoreElement.textContent = scores.player;
    computerScoreElement.textContent = scores.computer;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 5;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawCenterLine();
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();