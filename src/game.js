// filepath: the-worlds-hardest-game/the-worlds-hardest-game/src/game.js
// game.js

import levels from './assets/levels.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player;
let obstacles = [];
let levelData;
let currentLevel = 0;
let gameOver = false;

function init() {
    player = {
        x: 50,
        y: canvas.height - 60,
        width: 30,
        height: 30,
        speed: 5,
        color: 'blue'
    };
    loadLevel(currentLevel);
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(gameLoop);
}

function loadLevel(levelIndex) {
    levelData = levels[levelIndex];
    // Não precisa mais de obstacles, use platforms direto no drawPlatforms
    player.x = levelData.playerStart.x;
    player.y = levelData.playerStart.y;
}

function handleKeyDown(event) {
    if (event.key === 'ArrowUp') {
        player.y -= player.speed;
    } else if (event.key === 'ArrowDown') {
        player.y += player.speed;
    } else if (event.key === 'ArrowLeft') {
        player.x -= player.speed;
    } else if (event.key === 'ArrowRight') {
        player.x += player.speed;
    }
    checkCollision();
}

// 1. Mover inimigos (bolas azuis) e rebater nas bordas
function updateEnemies() {
    levelData.enemies.forEach(e => {
        e.x += e.dx;
        e.y += e.dy;

        // Rebater nas bordas do canvas
        if (e.x - e.radius < 0 || e.x + e.radius > canvas.width) {
            e.dx *= -1;
        }
        if (e.y - e.radius < 0 || e.y + e.radius > canvas.height) {
            e.dy *= -1;
        }
    });
}

// 2. Detectar colisão com inimigos
function checkEnemyCollision() {
    levelData.enemies.forEach(e => {
        const distX = (player.x + player.width / 2) - e.x;
        const distY = (player.y + player.height / 2) - e.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < e.radius + player.width / 2) {
            gameOver = true;
        }
    });
}

// 3. Detectar chegada na meta
function checkGoalCollision() {
    const g = levelData.goal;
    const distX = (player.x + player.width / 2) - g.x;
    const distY = (player.y + player.height / 2) - g.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < g.width / 2 + player.width / 2) {
        nextLevel();
    }
}

// 4. Trocar de nível
function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
        alert('Parabéns! Você completou todos os níveis!');
        currentLevel = 0;
    }
    loadLevel(currentLevel);
    // Reinicia posição do jogador
    player.x = levels[currentLevel].playerStart.x;
    player.y = levels[currentLevel].playerStart.y;
    gameOver = false;
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver = true;
        }
    });
}

function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateEnemies(); // <-- Atualiza inimigos
    drawPlayer();
    drawObstacles();
    drawPlatforms();
    drawEnemies();
    drawGoal();
    checkEnemyCollision(); // <-- Checa colisão com inimigos
    checkGoalCollision();  // <-- Checa chegada na meta
    requestAnimationFrame(gameLoop);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = 'black';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawPlatforms() {
    ctx.fillStyle = 'gray';
    levelData.platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'blue';
    levelData.enemies.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawGoal() {
    ctx.fillStyle = 'gold';
    const g = levelData.goal;
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.width / 2, 0, Math.PI * 2);
    ctx.fill();
}

init();